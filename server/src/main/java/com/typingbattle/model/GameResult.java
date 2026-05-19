package com.typingbattle.model;

public class GameResult {
    private int rank;
    private String playerId;
    private String playerName;
    private int wpm;
    private double accuracy;
    private String finishedAt;

    public GameResult(String playerId, String playerName, int wpm, double accuracy, String finishedAt) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.wpm = wpm;
        this.accuracy = accuracy;
        this.finishedAt = finishedAt;
    }

    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }
    public String getPlayerId() { return playerId; }
    public String getPlayerName() { return playerName; }
    public int getWpm() { return wpm; }
    public double getAccuracy() { return accuracy; }
    public String getFinishedAt() { return finishedAt; }
}
