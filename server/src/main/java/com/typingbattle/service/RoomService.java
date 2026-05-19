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

    public void removeRoom(String roomCode) {
        rooms.remove(roomCode);
    }

    public Player joinRoom(String roomCode, String playerName) {
        return joinRoom(roomCode, playerName, false);
    }

    public Player joinRoom(String roomCode, String playerName, boolean spectator) {
        Room room = rooms.get(roomCode);
        if (room == null) throw new IllegalArgumentException("Room not found: " + roomCode);

        if (spectator) {
            if (!"waiting".equals(room.getStatus()) && !"playing".equals(room.getStatus()))
                throw new IllegalStateException("Game already finished");
        } else {
            long playerCount = room.getPlayers().stream().filter(p -> !p.isSpectator()).count();
            if (playerCount >= room.getMaxPlayers()) throw new IllegalStateException("Room is full");
            if (!"waiting".equals(room.getStatus())) throw new IllegalStateException("Game already started");
        }

        String playerId = generatePlayerId();
        Player player = new Player(playerId, playerName, false, spectator);
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
            .ifPresent(p -> p.setProgress(progress));
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

    public void forfeitPlayer(String roomCode, String playerId) {
        Room room = rooms.get(roomCode);
        if (room == null) return;
        room.getPlayers().stream()
            .filter(p -> p.getPlayerId().equals(playerId))
            .findFirst()
            .ifPresent(p -> {
                p.setForfeited(true);
                p.setFinished(true);
                GameResult result = new GameResult(p.getPlayerId(), p.getPlayerName(), 0, 0.0, null);
                room.addResult(result);
            });
    }

    public boolean isRoundFinished(String roomCode) {
        Room room = rooms.get(roomCode);
        if (room == null) return false;
        return room.getPlayers().stream().filter(p -> !p.isSpectator()).allMatch(Player::isFinished);
    }

    public void forceFinishUnfinished(String roomCode) {
        Room room = rooms.get(roomCode);
        if (room == null) return;
        room.getPlayers().stream()
            .filter(p -> !p.isSpectator() && !p.isFinished())
            .forEach(p -> {
                GameResult result = new GameResult(p.getPlayerId(), p.getPlayerName(), 0, 0.0,
                    java.time.Instant.now().toString());
                room.addResult(result);
                p.setProgress(0);
                p.setFinished(true);
            });
    }

    public String getRoundWinner(String roomCode) {
        Room room = rooms.get(roomCode);
        if (room == null || room.getResults().isEmpty()) return null;

        // 기권자 playerId 목록
        java.util.Set<String> forfeitedIds = room.getPlayers().stream()
            .filter(Player::isForfeited)
            .map(Player::getPlayerId)
            .collect(java.util.stream.Collectors.toSet());

        // 기권자 제외하고 최고 WPM 찾기
        GameResult best = room.getResults().stream()
            .filter(r -> !forfeitedIds.contains(r.getPlayerId()))
            .max(java.util.Comparator.comparingInt(GameResult::getWpm))
            .orElse(null);
        if (best == null) return null;
        room.addWin(best.getPlayerId());
        return best.getPlayerId();
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
        String newText = textService.pickRandomText(room.getTextType(), null, room.getText());
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
