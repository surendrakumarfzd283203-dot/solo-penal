package com.solopenal;

import android.os.Bundle;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class PanelActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_panel);

        Button btnClose = findViewById(R.id.btnClose);
        btnClose.setOnClickListener(v -> finish());

        LinearLayout layoutRummy = findViewById(R.id.layoutRummy);
        layoutRummy.setOnClickListener(v -> {
            Toast.makeText(this, "Entering Rummy Game...", Toast.LENGTH_SHORT).show();
            // Intent intent = new Intent(this, RummyActivity.class);
            // startActivity(intent);
        });

        LinearLayout layoutBigSmall = findViewById(R.id.layoutBigSmall);
        layoutBigSmall.setOnClickListener(v -> {
            Toast.makeText(this, "Entering Big Small Game...", Toast.LENGTH_SHORT).show();
            // Intent intent = new Intent(this, BigSmallActivity.class);
            // startActivity(intent);
        });
    }
}
