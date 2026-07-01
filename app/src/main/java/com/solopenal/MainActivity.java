package com.solopenal;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends AppCompatActivity {
    private static final int ACTION_MANAGE_OVERLAY_PERMISSION_REQUEST_CODE = 5469;
    private EditText etUserKey, etPassword;
    private TextView tvStatus;
    private RequestQueue requestQueue;
    private SharedPreferences sharedPreferences;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        sharedPreferences = getSharedPreferences("SoloPenalPrefs", Context.MODE_PRIVATE);
        
        // Auto-login check
        if (sharedPreferences.getBoolean("isLoggedIn", false)) {
            checkAndStartPanel();
        }

        etUserKey = findViewById(R.id.etUserKey);
        etPassword = findViewById(R.id.etPassword);
        tvStatus = findViewById(R.id.tvStatus);
        requestQueue = Volley.newRequestQueue(this);

        Button btnStartPanel = findViewById(R.id.btnStartPanel);
        btnStartPanel.setOnClickListener(v -> {
            String userId = etUserKey.getText().toString().trim();
            String password = etPassword.getText().toString().trim();

            if (userId.isEmpty() || password.isEmpty()) {
                tvStatus.setText("Enter credentials!");
                return;
            }

            performLogin(userId, password);
        });
    }

    private void performLogin(String userId, String password) {
        tvStatus.setText("Connecting to server...");
        String url = "https://solo-penal.onrender.com/api/login";

        JSONObject loginData = new JSONObject();
        try {
            loginData.put("userId", userId);
            loginData.put("password", password);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url, loginData,
                response -> {
                    try {
                        if (response.getBoolean("success")) {
                            tvStatus.setText("Login Success!");
                            sharedPreferences.edit().putBoolean("isLoggedIn", true).apply();
                            checkAndStartPanel();
                        } else {
                            tvStatus.setText(response.getString("error"));
                        }
                    } catch (JSONException e) {
                        tvStatus.setText("Response Error");
                    }
                },
                error -> {
                    tvStatus.setText("Server Error: Check your connection");
                });

        requestQueue.add(request);
    }

    private void checkAndStartPanel() {
        if (checkPermission()) {
            startService(new Intent(MainActivity.this, FloatingService.class));
            finish();
        } else {
            requestPermission();
        }
    }

    private boolean checkPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return Settings.canDrawOverlays(this);
        }
        return true;
    }

    private void requestPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + getPackageName()));
            startActivityForResult(intent, ACTION_MANAGE_OVERLAY_PERMISSION_REQUEST_CODE);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == ACTION_MANAGE_OVERLAY_PERMISSION_REQUEST_CODE) {
            if (checkPermission()) {
                startService(new Intent(MainActivity.this, FloatingService.class));
                finish();
            } else {
                Toast.makeText(this, "Permission required for overlay", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
