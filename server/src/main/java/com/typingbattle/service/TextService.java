package com.typingbattle.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class TextService {

    private static final List<String> ENGLISH_TEXTS = List.of(
        "Call me Ishmael. Some years ago, never mind how long precisely, having little or no money in my purse, I thought I would sail about a little.",
        "It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind.",
        "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump.",
        "In the beginning, there was nothing. Then there was everything. The universe expanded in a heartbeat, filling the void with light and matter."
    );

    private static final List<String> KOREAN_TEXTS = List.of(
        "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",
        "죽는 날까지 하늘을 우러러 한 점 부끄럼이 없기를 잎새에 이는 바람에도 나는 괴로워했다",
        "가는 말이 고와야 오는 말이 곱다 낮말은 새가 듣고 밤말은 쥐가 듣는다 세 살 버릇 여든까지 간다"
    );

    public String pickRandomText(String textType, String customText) {
        if ("custom".equals(textType) && customText != null && !customText.isBlank()) {
            return customText;
        }
        List<String> pool = "korean".equals(textType) ? KOREAN_TEXTS : ENGLISH_TEXTS;
        return pool.get(ThreadLocalRandom.current().nextInt(pool.size()));
    }
}
