package com.example;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class MainTest {

    @Test
    public void testContas() {
        Main main = new Main();
        assertEquals(4, main.contas(2, 3));
    }
}
