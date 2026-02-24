package com.yourorg.service.exception;

import jakarta.persistence.RollbackException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(TransactionSystemException.class)
    public ResponseEntity<?> handleTx(TransactionSystemException ex) {

        Throwable root = ex;
        while (root.getCause() != null) {
            root = root.getCause();
        }

        root.printStackTrace(); // 🔥 THIS WILL SHOW DB ERROR

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "error", root.getClass().getSimpleName(),
                        "message", root.getMessage()
                ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleOther(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.status(500).body(
                Map.of("error", ex.getClass().getSimpleName(),
                        "message", ex.getMessage())
        );
    }
}
