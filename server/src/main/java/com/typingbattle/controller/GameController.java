package com.typingbattle.controller;

import com.typingbattle.dto.FinishPayload;
import com.typingbattle.dto.ProgressPayload;
import com.typingbattle.model.GameResult;
import com.typingbattle.model.Player;
import com.typingbattle.model.Room;
import com.typingbattle.service.RoomService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
public class GameController {

    private final RoomService roomService;
    private final SimpMessagingTemplate messaging;

    public GameController(RoomService roomService, SimpMessagingTemplate messaging) {
        this.roomService = roomService;
        this.messaging = messaging;
    }

    @MessageMapping("/room/{roomId}/start")
    public void startGame(@DestinationVariable String roomId) {
        roomService.startGame(roomId);

        Room room = roomService.getRoom(roomId);
        if (room == null) return;

        Map<String, Object> msg = new LinkedHashMap<>();
        msg.put("type", "GAME_START");
        msg.put("players", toPlayerList(room.getPlayers()));
        msg.put("totalRounds", room.getTotalRounds());
        msg.put("currentRound", room.getCurrentRound());
        messaging.convertAndSend("/topic/room/" + roomId, msg);
    }

    @MessageMapping("/game/{roomId}/progress")
    public void updateProgress(@DestinationVariable String roomId, ProgressPayload payload) {
        roomService.updateProgress(roomId, payload.getPlayerId(), payload.getProgress());

        Room room = roomService.getRoom(roomId);
        if (room == null) return;

        Map<String, Object> msg = new LinkedHashMap<>();
        msg.put("players", room.getPlayers().stream().map(p -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("playerId", p.getPlayerId());
            m.put("playerName", p.getPlayerName());
            m.put("progress", p.getProgress());
            m.put("isFinished", p.isFinished());
            return m;
        }).toList());
        messaging.convertAndSend("/topic/game/" + roomId, msg);
    }

    @MessageMapping("/game/{roomId}/finish")
    public void finishGame(@DestinationVariable String roomId, FinishPayload payload) {
        GameResult result = roomService.finishPlayer(
            roomId, payload.getPlayerId(), payload.getWpm(), payload.getAccuracy());

        Room room = roomService.getRoom(roomId);
        if (room == null) return;

        // 진행률 업데이트 브로드캐스트
        Map<String, Object> progressMsg = new LinkedHashMap<>();
        progressMsg.put("players", room.getPlayers().stream().map(p -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("playerId", p.getPlayerId());
            m.put("playerName", p.getPlayerName());
            m.put("progress", p.getProgress());
            m.put("isFinished", p.isFinished());
            return m;
        }).toList());
        messaging.convertAndSend("/topic/game/" + roomId, progressMsg);

        if (!roomService.isRoundFinished(roomId)) return;

        String winnerId = roomService.getRoundWinner(roomId);

        // 라운드 결과 브로드캐스트
        Map<String, Object> roundMsg = new LinkedHashMap<>();
        roundMsg.put("type", "ROUND_RESULT");
        roundMsg.put("currentRound", room.getCurrentRound());
        roundMsg.put("totalRounds", room.getTotalRounds());
        roundMsg.put("roundWinnerId", winnerId);
        roundMsg.put("results", room.getResults().stream().map(r -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("rank", r.getRank());
            m.put("playerId", r.getPlayerId());
            m.put("playerName", r.getPlayerName());
            m.put("wpm", r.getWpm());
            m.put("accuracy", r.getAccuracy());
            return m;
        }).toList());
        roundMsg.put("wins", room.getWins());
        messaging.convertAndSend("/topic/result/" + roomId, roundMsg);

        if (roomService.isGameOver(roomId)) {
            room.setStatus("finished");
            Map<String, Object> finalMsg = new LinkedHashMap<>();
            finalMsg.put("type", "GAME_OVER");
            finalMsg.put("wins", room.getWins());
            finalMsg.put("results", room.getResults());
            messaging.convertAndSend("/topic/result/" + roomId, finalMsg);
        } else {
            roomService.prepareNextRound(roomId);

            Map<String, Object> nextMsg = new LinkedHashMap<>();
            nextMsg.put("type", "NEXT_ROUND");
            nextMsg.put("currentRound", room.getCurrentRound());
            nextMsg.put("totalRounds", room.getTotalRounds());
            nextMsg.put("text", room.getText());
            nextMsg.put("wins", room.getWins());
            messaging.convertAndSend("/topic/result/" + roomId, nextMsg);
        }
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
