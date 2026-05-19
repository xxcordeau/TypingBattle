package com.typingbattle.dto;

public class JoinRoomRequest {
    private String playerName;
    private boolean spectator;

    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }
    public boolean isSpectator() { return spectator; }
    public void setSpectator(boolean spectator) { this.spectator = spectator; }
}
