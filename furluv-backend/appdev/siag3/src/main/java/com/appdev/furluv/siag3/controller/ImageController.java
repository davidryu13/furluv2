package com.appdev.furluv.siag3.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "http://127.0.0.1:5173")
public class ImageController {

    @Value("${file.upload-dir:uploads/}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }

            String contentType = file.getContentType();
            if (!contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "File must be an image"));
            }

            // Create upload directory if it doesn't exist
            File uploadDirectory = new File(uploadDir);
            if (!uploadDirectory.exists()) {
                uploadDirectory.mkdirs();
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + extension;

            // Save file
            Path filepath = Paths.get(uploadDir, filename);
            Files.write(filepath, file.getBytes());

            // Return response with file URL (point to controller endpoint)
            Map<String, String> response = new HashMap<>();
            response.put("filename", filename);
            // provide full backend-served URL so frontend can fetch the image
            response.put("url", "/api/images/uploads/" + filename);
            response.put("message", "Image uploaded successfully");

            // Log upload info for debugging
            System.out.println("[ImageController] Uploaded file: " + filename + ", saved to: " + filepath.toAbsolutePath());
            System.out.println("[ImageController] Returning URL: " + response.get("url"));

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        }
    }

    @PostMapping("/upload-document")
    public ResponseEntity<?> uploadDocument(@RequestParam("file") MultipartFile file) {
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }

            // Allow common document types: PDF, Word, Text, Images
            String contentType = file.getContentType();
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase() : "";
            
            // Whitelist allowed document extensions
            if (!isAllowedDocumentType(contentType, extension)) {
                return ResponseEntity.badRequest().body(Map.of("error", "File type not allowed. Allowed: PDF, DOCX, DOC, TXT, PNG, JPG, JPEG, GIF"));
            }

            // Create upload directory if it doesn't exist
            File uploadDirectory = new File(uploadDir);
            if (!uploadDirectory.exists()) {
                uploadDirectory.mkdirs();
            }

            // Generate unique filename
            String filename = UUID.randomUUID().toString() + extension;

            // Save file
            Path filepath = Paths.get(uploadDir, filename);
            Files.write(filepath, file.getBytes());

            // Return response with file URL
            Map<String, String> response = new HashMap<>();
            response.put("filename", filename);
            response.put("url", "/api/images/uploads/" + filename);
            response.put("message", "Document uploaded successfully");

            // Log upload info for debugging
            System.out.println("[ImageController] Uploaded document: " + filename + ", saved to: " + filepath.toAbsolutePath());
            System.out.println("[ImageController] Document URL: " + response.get("url"));

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload document: " + e.getMessage()));
        }
    }

    private boolean isAllowedDocumentType(String contentType, String extension) {
        if (contentType == null) {
            contentType = "";
        }
        
        // Check by content type or extension
        return contentType.startsWith("image/") ||
               contentType.equals("application/pdf") ||
               contentType.equals("application/msword") ||
               contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
               contentType.startsWith("text/") ||
               extension.equals(".pdf") ||
               extension.equals(".doc") ||
               extension.equals(".docx") ||
               extension.equals(".txt") ||
               extension.equals(".png") ||
               extension.equals(".jpg") ||
               extension.equals(".jpeg") ||
               extension.equals(".gif");
    }

    @GetMapping("/uploads/{filename}")
    public ResponseEntity<?> getImage(@PathVariable String filename) {
        try {
            Path filepath = Paths.get(uploadDir, filename);
            if (!Files.exists(filepath)) {
                return ResponseEntity.notFound().build();
            }

            byte[] imageData = Files.readAllBytes(filepath);
            String contentType = Files.probeContentType(filepath);
            
            return ResponseEntity.ok()
                    .header("Content-Type", contentType != null ? contentType : "image/png")
                    .body(imageData);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
