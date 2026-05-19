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
        "In the beginning, there was nothing. Then there was everything. The universe expanded in a heartbeat, filling the void with light and matter.",
        "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
        "To be, or not to be, that is the question: whether it is nobler in the mind to suffer the slings and arrows of outrageous fortune.",
        "We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights.",
        "All happy families are alike; each unhappy family is unhappy in its own way. Everything was in confusion in the house.",
        "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
        "The only way to do great work is to love what you do. If you have not found it yet, keep looking. Do not settle.",
        "Two roads diverged in a wood, and I took the one less traveled by, and that has made all the difference.",
        "A person who never made a mistake never tried anything new. Imagination is more important than knowledge.",
        "In three words I can sum up everything I have learned about life: it goes on. The best way out is always through.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts. Never give in, never surrender.",
        "The greatest glory in living lies not in never falling, but in rising every time we fall. Stay hungry, stay foolish."
    );

    private static final List<String> KOREAN_TEXTS = List.of(
        "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",
        "죽는 날까지 하늘을 우러러 한 점 부끄럼이 없기를 잎새에 이는 바람에도 나는 괴로워했다",
        "가는 말이 고와야 오는 말이 곱다 낮말은 새가 듣고 밤말은 쥐가 듣는다 세 살 버릇 여든까지 간다",
        "세종대왕께서 백성을 어여삐 여기시어 스물여덟 글자를 만드시니 사람마다 쉽게 익혀 날로 쓰기에 편안하게 하고자 함이라",
        "하늘과 바람과 별과 시 별 하나에 추억과 별 하나에 사랑과 별 하나에 쓸쓸함과 별 하나에 동경과 별 하나에 시와 별 하나에 어머니",
        "나보기가 역겨워 가실 때에는 말없이 고이 보내드리오리다 영변에 약산 진달래꽃 아름 따다 가실 길에 뿌리오리다",
        "산은 높고 물은 깊다 바람이 불어도 흔들리지 않는 큰 나무가 되자 뿌리가 깊은 나무는 가뭄에도 마르지 않는다",
        "천리 길도 한 걸음부터 시작된다 작은 노력이 모여 큰 결실을 이룬다 꾸준함이 천재를 이긴다",
        "호랑이는 죽어서 가죽을 남기고 사람은 죽어서 이름을 남긴다 오늘 하루를 내 인생의 마지막 날처럼 살자",
        "봄이 오면 산에 들에 진달래 피네 진달래 피는 곳에 내 마음도 피어 건너 마을 젊은 처자 꽃 따러 오거든 꽃만 따 가지 마오",
        "비 온 뒤에 땅이 굳어진다 고생 끝에 낙이 온다 어둠이 깊을수록 새벽은 가까이 온다 포기하지 말고 끝까지 해보자",
        "콩 심은 데 콩 나고 팥 심은 데 팥 난다 뿌린 대로 거두는 것이 세상의 이치이니 좋은 씨앗을 뿌리자",
        "우리가 함께 걷는 이 길이 꽃길이 되기를 바라며 서로의 손을 잡고 한 걸음씩 나아가자 멀리 가려면 함께 가라"
    );

    public String pickRandomText(String textType, String customText) {
        return pickRandomText(textType, customText, null);
    }

    public String pickRandomText(String textType, String customText, String previousText) {
        if ("custom".equals(textType) && customText != null && !customText.isBlank()) {
            return customText;
        }
        List<String> pool = "korean".equals(textType) ? KOREAN_TEXTS : ENGLISH_TEXTS;
        if (pool.size() <= 1) {
            return pool.get(0);
        }
        String picked;
        do {
            picked = pool.get(ThreadLocalRandom.current().nextInt(pool.size()));
        } while (picked.equals(previousText));
        return picked;
    }
}
