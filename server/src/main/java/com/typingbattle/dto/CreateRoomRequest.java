package com.typingbattle.dto;

public class CreateRoomRequest {
    private String hostName;
    private int maxPlayers;
    private String textType; // english, korean, custom
    private String customText;
    private int totalRounds = 1;

    public String getHostName() { return hostName; }
    public void setHostName(String hostName) { this.hostName = hostName; }
    public int getMaxPlayers() { return maxPlayers; }
    public void setMaxPlayers(int maxPlayers) { this.maxPlayers = maxPlayers; }
    public String getTextType() { return textType; }
    public void setTextType(String textType) { this.textType = textType; }
    public String getCustomText() { return customText; }
    public void setCustomText(String customText) { this.customText = customText; }
    public int getTotalRounds() { return totalRounds; }
    public void setTotalRounds(int totalRounds) { this.totalRounds = totalRounds; }
}
