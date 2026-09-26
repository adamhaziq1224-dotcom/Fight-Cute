# Original 5x7 grid alphabet packed as a minimal TrueType font; no third-party font asset.
import struct,math
from pathlib import Path
B=lambda fmt,*v:struct.pack('>'+fmt,*v)
patterns={
'A':'01110 10001 10001 11111 10001 10001 10001','B':'11110 10001 10001 11110 10001 10001 11110','C':'01111 10000 10000 10000 10000 10000 01111','D':'11110 10001 10001 10001 10001 10001 11110','E':'11111 10000 10000 11110 10000 10000 11111','F':'11111 10000 10000 11110 10000 10000 10000','G':'01111 10000 10000 10111 10001 10001 01111','H':'10001 10001 10001 11111 10001 10001 10001','I':'11111 00100 00100 00100 00100 00100 11111','J':'00111 00010 00010 00010 10010 10010 01100','K':'10001 10010 10100 11000 10100 10010 10001','L':'10000 10000 10000 10000 10000 10000 11111','M':'10001 11011 10101 10101 10001 10001 10001','N':'10001 11001 11001 10101 10011 10011 10001','O':'01110 10001 10001 10001 10001 10001 01110','P':'11110 10001 10001 11110 10000 10000 10000','Q':'01110 10001 10001 10001 10101 10010 01101','R':'11110 10001 10001 11110 10100 10010 10001','S':'01111 10000 10000 01110 00001 00001 11110','T':'11111 00100 00100 00100 00100 00100 00100','U':'10001 10001 10001 10001 10001 10001 01110','V':'10001 10001 10001 10001 10001 01010 00100','W':'10001 10001 10001 10101 10101 10101 01010','X':'10001 10001 01010 00100 01010 10001 10001','Y':'10001 10001 01010 00100 00100 00100 00100','Z':'11111 00001 00010 00100 01000 10000 11111',
'0':'01110 10001 10011 10101 11001 10001 01110','1':'00100 01100 00100 00100 00100 00100 01110','2':'01110 10001 00001 00110 01000 10000 11111','3':'11110 00001 00001 01110 00001 00001 11110','4':'00010 00110 01010 10010 11111 00010 00010','5':'11111 10000 10000 11110 00001 00001 11110','6':'01110 10000 10000 11110 10001 10001 01110','7':'11111 00001 00010 00100 01000 01000 01000','8':'01110 10001 10001 01110 10001 10001 01110','9':'01110 10001 10001 01111 00001 00001 01110',
'?':'01110 10001 00001 00010 00100 00000 00100','!':'00100 00100 00100 00100 00100 00000 00100','.':'00000 00000 00000 00000 00000 00110 00110',':':'00000 00110 00110 00000 00110 00110 00000','-':'00000 00000 00000 11111 00000 00000 00000','/':'00001 00001 00010 00100 01000 10000 10000','+':'00000 00100 00100 11111 00100 00100 00000',"'":'00100 00100 00000 00000 00000 00000 00000',',':'00000 00000 00000 00000 00110 00100 01000','(':'00010 00100 01000 01000 01000 00100 00010',')':'01000 00100 00010 00010 00010 00100 01000','=':'00000 00000 11111 00000 11111 00000 00000','%':'11001 11010 00010 00100 01000 01011 10011',' ':'00000 '*6+'00000'}
patterns['&']='01100 10010 10010 01100 10101 10010 01101'
patterns['*']='00000 10101 01110 11111 01110 10101 00000'
patterns['_']='00000 00000 00000 00000 00000 00000 11111'
chars=[chr(i) for i in range(32,127)]
glyf=b'';locations=[0];metrics=[]
for ch in ['?']+chars:
 rows=patterns.get(ch.upper(),patterns['?']).split();pts=[];ends=[]
 for y,row in enumerate(rows):
  for x,v in enumerate(row):
   if v=='1':
    xx=x*100;yy=(6-y)*100;pts.extend([(xx,yy),(xx,yy+100),(xx+100,yy+100),(xx+100,yy)]);ends.append(len(pts)-1)
 data=B('hhhhh',len(ends),0,0,500,700)+b''.join(B('H',e) for e in ends)+B('H',0)+bytes([1]*len(pts));prev=0
 for x,y in pts:data+=B('h',x-prev);prev=x
 prev=0
 for x,y in pts:data+=B('h',y-prev);prev=y
 data+=b'\0'*((-len(data))%4);glyf+=data;locations.append(len(glyf));metrics.append(B('Hh',600,0))
n=len(metrics);head=B('IIIIHHQQhhhhHHhhh',0x10000,0x10000,0,0x5F0F3CF5,3,1000,0,0,0,0,500,700,0,8,2,1,0)
hhea=B('IhhhHhhhhhhhhhhhH',0x10000,800,-200,0,600,0,100,500,1,0,0,0,0,0,0,0,n)
maxp=B('IH'+'H'*13,0x10000,n,120,30,0,0,1,0,0,0,0,0,0,0,0)
# cmap format 4: continuous ASCII segment + sentinel.
sub=B('HHHHHHH',4,32,0,4,4,1,0)+B('HHH',126,65535,0)+B('HH',32,65535)+B('hh',-31,1)+B('HH',0,0)
cmap=B('HHHHI',0,1,3,1,12)+sub
strings=b'';records=[]
for idx,value in [(1,'Retro Grid'),(2,'Regular'),(4,'Retro Grid'),(6,'RetroGrid')]:
 d=value.encode('utf-16-be');records.append(B('HHHHHH',3,1,1033,idx,len(d),len(strings)));strings+=d
name=B('HHH',0,len(records),6+12*len(records))+b''.join(records)+strings
post=B('IIhhIIIII',0x30000,0,0,0,1,0,0,0,0)
os2=B('HhHHH',0,600,400,5,0)+B('11h',650,600,0,75,650,600,0,350,50,300,0)+bytes([2,11,5,9,2,2,3,2,2,4])+B('4I',1,0,0,0)+b'FCTE'+B('HHHhhhHH',64,32,126,800,-200,0,800,200)
tables={'OS/2':os2,'head':head,'hhea':hhea,'maxp':maxp,'hmtx':b''.join(metrics),'glyf':glyf,'loca':b''.join(B('I',x) for x in locations),'cmap':cmap,'name':name,'post':post}
def checksum(data):
 data+=b'\0'*((-len(data))%4);return sum(struct.unpack('>'+'I'*(len(data)//4),data))&0xffffffff
count=len(tables);power=2**int(math.log2(count));header=B('IHHHH',0x10000,count,power*16,int(math.log2(power)),count*16-power*16);offset=12+count*16;directory=b'';body=b'';headpos=0
for tag,data in sorted(tables.items()):
 directory+=tag.encode()+B('III',checksum(data),offset,len(data))
 if tag=='head':headpos=offset
 padding=b'\0'*((-len(data))%4);body+=data+padding;offset+=len(data)+len(padding)
font=bytearray(header+directory+body);font[headpos+8:headpos+12]=B('I',(0xB1B0AFBA-checksum(bytes(font)))&0xffffffff)
r=Path(__file__).resolve().parent.parent/'assets/fonts';r.mkdir(parents=True,exist_ok=True);(r/'retro-grid.ttf').write_bytes(font)
print('Generated original Retro Grid font',len(font))
