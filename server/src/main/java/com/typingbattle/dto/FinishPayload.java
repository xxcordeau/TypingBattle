package com.typingbattle.dto;

public class FinishPayload {
    private String playerId;
    private int wpm;
    private double accuracy;

    public String getPlayerId() { return playerId; }
    public void setPlayerId(String playerId) { this.playerId = playerId; }
    public int getWpm() { return wpm; }
    public void setWpm(int wpm) { this.wpm = wpm; }
    public double getAccuracy() { return accuracy; }
    public void setAccuracy(double accuracy) { this.accuracy = accuracy; }
}
