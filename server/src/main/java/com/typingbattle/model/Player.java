package com.typingbattle.model;

public class Player {
    private String playerId;
    private String playerName;
    private boolean isHost;
    private boolean spectator;
    private int progress;
    private boolean finished;
    private boolean forfeited;

    public Player(String playerId, String playerName, boolean isHost) {
        this(playerId, playerName, isHost, false);
    }

    public Player(String playerId, String playerName, boolean isHost, boolean spectator) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.isHost = isHost;
        this.spectator = spectator;
        this.progress = 0;
        this.finished = spectator;
        this.forfeited = false;
    }

    public String getPlayerId() { return playerId; }
    public String getPlayerName() { return playerName; }
    public boolean isHost() { return isHost; }
    public boolean getIsHost() { return isHost; }
    public boolean isSpectator() { return spectator; }
    public boolean getIsSpectator() { return spectator; }
    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }
    public boolean isFinished() { return finished; }
    public boolean getIsFinished() { return finished; }
    public void setFinished(boolean finished) { this.finished = finished; }
    public boolean isForfeited() { return forfeited; }
    public boolean getIsForfeited() { return forfeited; }
    public void setForfeited(boolean forfeited) { this.forfeited = forfeited; }
}
