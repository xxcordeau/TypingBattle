package com.typingbattle.service;

import com.typingbattle.model.GameResult;
import com.typingbattle.model.Player;
import com.typingbattle.model.Room;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class RoomService {

    private final Map<String, Room> rooms = new ConcurrentHashMap<>();
    private final TextService textService;

    public RoomService(TextService textService) {
        this.textService = textService;
    }

    public Room createRoom(String hostName, int maxPlayers, String textType, String customText, int totalRounds) {
        String roomCode = generateRoomCode();
        String text = textService.pickRandomText(textType, customText);
        String hostId = generatePlayerId();

        Room room = new Room(roomCode, hostId, text, textType, maxPlayers, totalRounds);
        room.addPlayer(new Player(hostId, hostName, true));
        rooms.put(roomCode, room);
        return room;
    }

    public Room getRoom(String roomCode) {
        return rooms.get(roomCode);
    }

    public Player joinRoom(String roomCode, String playerName) {
        Room room = rooms.get(roomCode);
        if (room == null) throw new IllegalArgumentException("Room not found: " + roomCode);
        if (room.getPlayers().size() >= room.getMaxPlayers()) throw new IllegalStateException("Room is full");
        if (!"waiting".equals(room.getStatus())) throw new IllegalStateException("Game already started");

        String playerId = generatePlayerId();
        Player player = new Player(playerId, playerName, false);
        room.addPlayer(player);
        return player;
    }

    public void leaveRoom(String roomCode, String playerId) {
        Room room = rooms.get(roomCode);
        if (room == null) return;
        room.removePlayer(playerId);
        if (room.getPlayers().isEmpty()) {
            rooms.remove(roomCode);
        }
    }

    public void startGame(String roomCode) {
        Room room = rooms.get(roomCode);
        if (room != null) {
            room.setStatus("playing");
        }
    }

    public void updateProgress(String roomCode, String playerId, int progress) {
        Room room = rooms.get(roomCode);
        if (room == null) return;
        room.getPlayers().stream()
            .filter(p -> p.getPlayerId().equals(playerId))
            .findFirst()
            .ifPresent(p -> {
                p.setProgress(progress);
                if (progress >= 100) p.setFinished(true);
            });
    }

    public GameResult finishPlayer(String roomCode, String playerId, int wpm, double accuracy) {
        Room room = rooms.get(roomCode);
        if (room == null) return null;

        String playerName = room.getPlayers().stream()
            .filter(p -> p.getPlayerId().equals(playerId))
            .map(Player::getPlayerName)
            .findFirst()
            .orElse("Unknown");

        GameResult result = new GameResult(playerId, playerName, wpm, accuracy,
            java.time.Instant.now().toString());
        room.addResult(result);

        room.getPlayers().stream()
            .filter(p -> p.getPlayerId().equals(playerId))
            .findFirst()
            .ifPresent(p -> {
                p.setProgress(100);
                p.setFinished(true);
            });

        return result;
    }

    public boolean isRoundFinished(String roomCode) {
        Room room = rooms.get(roomCode);
        if (room == null) return false;
        return room.getPlayers().stream().allMatch(Player::isFinished);
    }

    public String getRoundWinner(String roomCode) {
        Room room = rooms.get(roomCode);
        if (room == null || room.getResults().isEmpty()) return null;
        GameResult first = room.getResults().get(0);
        room.addWin(first.getPlayerId());
        return first.getPlayerId();
    }

    public boolean isGameOver(String roomCode) {
        Room room = rooms.get(roomCode);
        if (room == null) return true;
        int needed = (room.getTotalRounds() / 2) + 1;
        return room.getWins().values().stream().anyMatch(w -> w >= needed);
    }

    public void prepareNextRound(String roomCode) {
        Room room = rooms.get(roomCode);
        if (room == null) return;
        String newText = textService.pickRandomText(room.getTextType(), null);
        room.setText(newText);
        room.resetForNextRound();
    }

    private String generateRoomCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            sb.append(chars.charAt(ThreadLocalRandom.current().nextInt(chars.length())));
        }
        String code = sb.toString();
        if (rooms.containsKey(code)) return generateRoomCode();
        return code;
    }

    private String generatePlayerId() {
        return "p-" + Long.toHexString(ThreadLocalRandom.current().nextLong());
    }
}
