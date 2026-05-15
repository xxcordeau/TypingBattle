package com.typingbattle.model;

public class Player {
    private String playerId;
    private String playerName;
    private boolean isHost;
    private int progress;
    private boolean finished;

    public Player(String playerId, String playerName, boolean isHost) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.isHost = isHost;
        this.progress = 0;
        this.finished = false;
    }

    public String getPlayerId() { return playerId; }
    public String getPlayerName() { return playerName; }
    public boolean isHost() { return isHost; }
    public boolean getIsHost() { return isHost; }
    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }
    public boolean isFinished() { return finished; }
    public boolean getIsFinished() { return finished; }
    public void setFinished(boolean finished) { this.finished = finished; }
}
