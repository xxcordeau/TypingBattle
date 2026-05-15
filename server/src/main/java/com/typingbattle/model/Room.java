package com.typingbattle.model;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

public class Room {
    private String roomId;
    private String roomCode;
    private String hostId;
    private String text;
    private String textType;
    private int maxPlayers;
    private String status; // waiting, playing, finished
    private int totalRounds;
    private int currentRound;
    private final Map<String, Integer> wins = new ConcurrentHashMap<>();
    private final List<Player> players = new CopyOnWriteArrayList<>();
    private final List<GameResult> results = new CopyOnWriteArrayList<>();

    public Room(String roomCode, String hostId, String text, String textType, int maxPlayers, int totalRounds) {
        this.roomId = roomCode;
        this.roomCode = roomCode;
        this.hostId = hostId;
        this.text = text;
        this.textType = textType;
        this.maxPlayers = maxPlayers;
        this.totalRounds = totalRounds;
        this.currentRound = 1;
        this.status = "waiting";
    }

    public String getRoomId() { return roomId; }
    public String getRoomCode() { return roomCode; }
    public String getHostId() { return hostId; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getTextType() { return textType; }
    public int getMaxPlayers() { return maxPlayers; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public int getTotalRounds() { return totalRounds; }
    public int getCurrentRound() { return currentRound; }
    public void setCurrentRound(int currentRound) { this.currentRound = currentRound; }
    public Map<String, Integer> getWins() { return wins; }
    public List<Player> getPlayers() { return players; }
    public List<GameResult> getResults() { return results; }

    public void addPlayer(Player player) {
        players.add(player);
        wins.putIfAbsent(player.getPlayerId(), 0);
    }

    public void removePlayer(String playerId) {
        players.removeIf(p -> p.getPlayerId().equals(playerId));
        wins.remove(playerId);
    }

    public void addResult(GameResult result) {
        results.add(result);
        result.setRank(results.size());
    }

    public void addWin(String playerId) {
        wins.merge(playerId, 1, Integer::sum);
    }

    public void resetForNextRound() {
        currentRound++;
        results.clear();
        for (Player p : players) {
            p.setProgress(0);
            p.setFinished(false);
        }
        status = "playing";
    }
}
