package com.example.cicomposeapp


import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.contentDescription

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    HelloCI()
                }
            }
        }
    }
}

@Composable
fun HelloCI() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .semantics(mergeDescendants = true) { contentDescription = "hello" }, // ← erişilebilirlik id
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "Hello CI 👋",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.SemiBold
            // Text üzerinde ekstra semantics verme
        )
    }
}

@Preview(showBackground = true)
@Composable
fun HelloCIPreview() {
    MaterialTheme { HelloCI() }
}