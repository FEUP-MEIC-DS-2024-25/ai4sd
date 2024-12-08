package com.example;
public class Main {
    public int contas(int a, int b) {
        int c = a + b;
        int d = c - 1;
        if (d > 10) {
            return d % 10;
        } else {
            return d;
        }
    }

    public static void main(String[] args) {
        Main main = new Main();
        System.out.println("Resultado: " + main.contas(2, 3));
    }
}
