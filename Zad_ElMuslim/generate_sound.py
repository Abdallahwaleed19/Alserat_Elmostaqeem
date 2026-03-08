import math
import struct
import wave
import os

sample_rate = 44100
duration = 1.0 # seconds
num_samples = int(sample_rate * duration)

def generate_sample(t):
    # Envelopes
    env1 = math.exp(-t * 5)
    env2 = math.exp(-t * 8)
    env3 = math.exp(-t * 12)
    
    # Frequencies (C6 major chordish bell, very pleasant)
    f1 = 1046.50 # C6
    f2 = 1318.51 # E6
    f3 = 1567.98 # G6
    f4 = 2093.00 # C7
    
    val = (
        0.5 * env1 * math.sin(2 * math.pi * f1 * t) +
        0.3 * env2 * math.sin(2 * math.pi * f2 * t) +
        0.2 * env3 * math.sin(2 * math.pi * f3 * t) +
        0.1 * env3 * math.sin(2 * math.pi * f4 * t)
    )
    return val

output_path = 'chime.wav'
with wave.open(output_path, 'w') as obj:
    obj.setnchannels(1) # mono
    obj.setsampwidth(2)
    obj.setframerate(sample_rate)
    
    for i in range(num_samples):
        t = float(i) / sample_rate
        val = generate_sample(t)
        # Normalize to 16-bit range
        amplitude = int(val * 32767 * 0.5) 
        if amplitude > 32767:
            amplitude = 32767
        elif amplitude < -32768:
            amplitude = -32768
        obj.writeframesraw(struct.pack('<h', amplitude))

print("Created chime.wav")
