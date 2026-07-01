package com.solopenal;

import android.os.Bundle;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;

public class PanelActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_panel);

        Button btnClose = findViewById(R.id.btnClose);
        btnClose.setOnClickListener(v -> {
            finish();
        });
    }
}
