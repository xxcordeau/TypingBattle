package com.typingbattle.controller;

import com.typingbattle.dto.CreateRoomRequest;
import com.typingbattle.dto.JoinRoomRequest;
import com.typingbattle.dto.LeaveRoomRequest;
import com.typingbattle.model.Player;
import com.typingbattle.model.Room;
import com.typingbattle.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;
    private final SimpMessagingTemplate messaging;

    public RoomController(RoomService roomService, SimpMessagingTemplate messaging) {
        this.roomService = roomService;
        this.messaging = messaging;
    }

    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody CreateRoomRequest req) {
        Room room = roomService.createRoom(
            req.getHostName(), req.getMaxPlayers(), req.getTextType(), req.getCustomText(), req.getTotalRounds());

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("roomId", room.getRoomId());
        res.put("roomCode", room.getRoomCode());
        res.put("hostId", room.getHostId());
        res.put("text", room.getText());
        res.put("maxPlayers", room.getMaxPlayers());
        res.put("totalRounds", room.getTotalRounds());
        res.put("status", room.getStatus());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/{roomCode}/join")
    public ResponseEntity<?> joinRoom(@PathVariable String roomCode, @RequestBody JoinRoomRequest req) {
        try {
            Player player = roomService.joinRoom(roomCode, req.getPlayerName());
            Room room = roomService.getRoom(roomCode);

            // WebSocket으로 대기실에 알림
            Map<String, Object> wsMsg = new LinkedHashMap<>();
            wsMsg.put("type", "PLAYER_JOINED");
            wsMsg.put("players", toPlayerList(room.getPlayers()));
            messaging.convertAndSend("/topic/room/" + room.getRoomId(), wsMsg);

            Map<String, Object> res = new LinkedHashMap<>();
            res.put("playerId", player.getPlayerId());
            res.put("roomId", room.getRoomId());
            res.put("roomCode", room.getRoomCode());
            res.put("text", room.getText());
            res.put("players", toPlayerList(room.getPlayers()));
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{roomCode}/leave")
    public ResponseEntity<?> leaveRoom(@PathVariable String roomCode, @RequestBody LeaveRoomRequest req) {
        roomService.leaveRoom(roomCode, req.getPlayerId());

        Room room = roomService.getRoom(roomCode);
        if (room != null) {
            Map<String, Object> wsMsg = new LinkedHashMap<>();
            wsMsg.put("type", "PLAYER_LEFT");
            wsMsg.put("players", toPlayerList(room.getPlayers()));
            messaging.convertAndSend("/topic/room/" + room.getRoomId(), wsMsg);
        }

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{roomCode}/result")
    public ResponseEntity<?> getResult(@PathVariable String roomCode) {
        Room room = roomService.getRoom(roomCode);
        if (room == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Room not found"));
        }

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("roomId", room.getRoomId());
        res.put("results", room.getResults());
        return ResponseEntity.ok(res);
    }

    private List<Map<String, Object>> toPlayerList(List<Player> players) {
        return players.stream().map(p -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("playerId", p.getPlayerId());
            m.put("playerName", p.getPlayerName());
            m.put("isHost", p.isHost());
            return m;
        }).toList();
    }
}
