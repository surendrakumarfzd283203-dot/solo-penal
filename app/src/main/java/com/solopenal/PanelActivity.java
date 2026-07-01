package com.solopenal;

import android.os.Bundle;
import android.widget.Button;
import android.widget.Switch;
import androidx.appcompat.app.AppCompatActivity;

public class PanelActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_panel);

        // Find Switches
        Switch swEsp = findViewById(R.id.switchESP);
        Switch swAimbot = findViewById(R.id.switchAimbot);
        Switch swHeadshot = findViewById(R.id.switchHeadshot);
        Switch swRecoil = findViewById(R.id.switchRecoil);
        Switch swSpeed = findViewById(R.id.switchSpeed);

        // Set listeners to ModFunctions
        swEsp.setOnCheckedChangeListener((v, isChecked) -> ModFunctions.toggleESP(this, isChecked));
        swAimbot.setOnCheckedChangeListener((v, isChecked) -> ModFunctions.toggleAimbot(this, isChecked));
        swHeadshot.setOnCheckedChangeListener((v, isChecked) -> ModFunctions.toggleHeadshot(this, isChecked));
        swRecoil.setOnCheckedChangeListener((v, isChecked) -> ModFunctions.toggleNoRecoil(this, isChecked));
        swSpeed.setOnCheckedChangeListener((v, isChecked) -> ModFunctions.toggleSpeedHack(this, isChecked));

        Button btnClose = findViewById(R.id.btnClose);
        btnClose.setOnClickListener(v -> finish());
    }
}
