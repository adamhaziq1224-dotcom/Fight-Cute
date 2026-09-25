import math,wave,array
from pathlib import Path
rate=22050;beat=.5;bars=32;length=bars*4*beat;buf=array.array('f',[0])*(int(length*rate))
def note(midi,start,dur,vol,kind='lead'):
 freq=440*2**((midi-69)/12);a=int(start*rate);n=min(int(dur*rate),len(buf)-a)
 for i in range(n):
  t=i/rate;env=min(1,t/.014)*min(1,(dur-t)/.11)
  if kind=='pad':v=math.sin(2*math.pi*freq*t)+.2*math.sin(4*math.pi*freq*t);env*=.65
  elif kind=='bass':v=math.sin(2*math.pi*freq*t)+.22*math.sin(4*math.pi*freq*t)
  else:v=math.sin(2*math.pi*freq*t)+.23*math.sin(6*math.pi*freq*t)+.09*math.sin(10*math.pi*freq*t);env*=math.exp(-t*2)
  buf[a+i]+=vol*v*env
chords=[(48,60,64,67),(43,59,62,67),(45,60,64,69),(41,57,60,65)]
melodies=[[76,79,81,79,76,74,72,74],[74,79,77,74,71,74,76,79],[76,81,79,76,72,74,76,72],[77,76,74,72,69,72,74,76]]
for bar in range(bars):
 start=bar*2;root,*ch=chords[bar%4]
 for pitch in ch:note(pitch,start,1.98,.023,'pad')
 for k in range(4):
  note(root+(12 if k==3 else 0),start+k*.5,.35,.085,'bass')
  # Round kick and crisp, quiet electronic percussion.
  a=int((start+k*.5)*rate)
  for i in range(int(.16*rate)):
   t=i/rate;buf[a+i]+=.11*math.sin(2*math.pi*(65*t+3*(1-math.exp(-t*30))))*math.exp(-t*33)
  a=int((start+k*.5+.25)*rate)
  for i in range(int(.045*rate)):
   t=i/rate;buf[a+i]+=.014*(math.sin(t*17453)+math.sin(t*22971))*math.exp(-t*95)
 for j in range(8):
  note(ch[j%3]+12,start+j*.25,.19,.022)
  if bar>=4 and (j!=7 or bar%2==0):note(melodies[bar%4][j]+(0 if bar<24 else -12),start+j*.25,.22 if j%2 else .3,.057)
# A very short boundary fade prevents clicks while keeping the pulse at loop edges.
for i in range(160):buf[i]*=i/160;buf[-1-i]*=i/160
pcm=array.array('h',(int(max(-1,min(1,v))*26000) for v in buf))
out=Path(__file__).resolve().parent.parent/'assets/audio';out.mkdir(parents=True,exist_ok=True)
with wave.open(str(out/'expedition-theme.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(pcm.tobytes())
print('Created original 64-second adventure loop')
