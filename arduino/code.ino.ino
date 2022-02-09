#define LED_GAME_PIN 13
#define LED_A_PIN 12
#define LED_B_PIN 11
#define LED_C_PIN 10

#define LED_AVG_R_PIN 9
#define LED_AVG_Y_PIN 8
#define LED_AVG_G_PIN 7

#define SWITCH_GAME_PIN 2
#define SWITCH_LED_PIN 3

#define SWITCH_LED_A_PIN A0
#define SWITCH_LED_B_PIN A1
#define SWITCH_LED_C_PIN A2

bool gameStarted = false;
int currentLed = -1;
int timer = -1;

int gameLedList[3] = { LED_A_PIN, LED_B_PIN, LED_C_PIN};
int avgLedList[3] = { LED_AVG_R_PIN, LED_AVG_Y_PIN, LED_AVG_G_PIN};

unsigned long timeStart = 0;
unsigned long timeEnd = 0;
unsigned long timeReactivity = 0;

void setup() {
  // switch setup
  attachInterrupt(digitalPinToInterrupt( SWITCH_GAME_PIN ), startGame, FALLING );
  attachInterrupt(digitalPinToInterrupt( SWITCH_LED_PIN ), handleclick, HIGH );

  // switch led setup
  pinMode(SWITCH_LED_A_PIN, INPUT);
  pinMode(SWITCH_LED_B_PIN, INPUT);
  pinMode(SWITCH_LED_C_PIN, INPUT);

  // Game led setup
  pinMode( LED_GAME_PIN, OUTPUT );
  pinMode( LED_A_PIN, OUTPUT );
  pinMode( LED_B_PIN, OUTPUT );
  pinMode( LED_C_PIN, OUTPUT );

  // avg led setup
  pinMode( LED_AVG_R_PIN, OUTPUT );
  pinMode( LED_AVG_Y_PIN, OUTPUT );
  pinMode( LED_AVG_G_PIN, OUTPUT );

  // Serial port
  Serial.begin(9600);
}

void loop() {
  delay(5);
  
  if(Serial.available() > 0) // Read from serial port
  {
    char ReaderFromNode; // Store current character
    ReaderFromNode = (char) Serial.read();
    
    Serial.print(ReaderFromNode);
  }
  
  if (gameStarted) {
    if (currentLed == -1) {
      currentLed = random(3);
      timer = random(100, 500); // from 0,5s to 2,5s
      
    } else if (timer == 0 && timeStart == 0) {
      // allume la led & démarre le chrono
      digitalWrite( gameLedList[currentLed], HIGH );
      timeStart = micros();
      
    } else if (timer == 0) {
      // allume uniquement la led
      digitalWrite( gameLedList[currentLed], HIGH );
      
    } else {
      timer--;
    }
  }
}

void startGame () {
  gameStarted = !gameStarted;
  Serial.println("Game running");
  if (gameStarted) {
    digitalWrite( LED_GAME_PIN, HIGH );
    Serial.println("Game running");
  } else {
    digitalWrite( LED_GAME_PIN, LOW );
    if (currentLed != -1) {
      digitalWrite( gameLedList[currentLed], LOW );
    }
    currentLed = -1;
    timer = -1;
    Serial.println("Game stopped");
  }
}

void handleclick() {
  int clickedButton = -1;
  if (digitalRead(SWITCH_LED_A_PIN) == 1) {
    clickedButton = 0;
  } else if (digitalRead(SWITCH_LED_B_PIN) == 1) {
    clickedButton = 1;
  } else if (digitalRead(SWITCH_LED_C_PIN) == 1) {
    clickedButton = 2;
  }
  if (timer == 0 && currentLed == clickedButton) {
    //close chrono
    timeEnd = micros();
    digitalWrite( gameLedList[currentLed], LOW );
    currentLed = -1;

    //send reactivity time via serial port
    timeReactivity = timeEnd - timeStart;
    int val = timeReactivity/1000;
    Serial.println("TIME (ms) :");
    Serial.println(val);

    timeStart = 0;
    timeEnd = 0;
    timeReactivity = 0;
  }
}