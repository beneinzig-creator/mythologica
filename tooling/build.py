import re,sys
import os; S=os.path.dirname(os.path.abspath(__file__))+'/'
src=open(S+'before_step12.html',encoding='utf-8').read()
A=open(S+'engine_a.js',encoding='utf-8').read()
B=open(S+'engine_b.js',encoding='utf-8').read()
def rep(s,o,n,cnt=1):
    assert s.count(o)==cnt,(s.count(o),o[:60]); return s.replace(o,n)
# engine_a patches
for a in ["priest:(s,o)=>{const b=best(cr(o)","nestor:(s,o)=>{const b=best(cr(o)"]:
    A=rep(A,a,a.replace('cr(o)','tg(o)'))
A=rep(A,"slinger:(s,o)=>{const E=cr(o)","slinger:(s,o)=>{const E=tg(o)")
A=rep(A,"cass:(s,o)=>{const E=cr(o)","cass:(s,o)=>{const E=tg(o)")
A=rep(A,"if(th(c)>0&&c.dmg>=th(c)&&has(c,'z')&&!c.rs){c.rs=1;c.dmg=th(c)-1;","if(th(c)>0&&(c.dmg>=th(c)||c.vn)&&has(c,'z')&&!c.rs){c.rs=1;c.vn=0;c.dmg=Math.min(c.dmg,th(c)-1);")
A=rep(A,"if(th(c)<=0||c.dmg>=th(c)){","if(th(c)<=0||c.dmg>=th(c)||c.vn){")
A=rep(A,"c.dmg=0;c.tap=0;c.def=0;c.ta=c.td=0;s.gy.push(c)","c.dmg=0;c.tap=0;c.def=0;c.ta=c.td=0;c.vn=0;s.gy.push(c)") if "c.dmg=0;c.tap=0;c.def=0;c.ta=c.td=0;s.gy.push(c)" in A else A
L=src.split('\n')
def idx(prefix,start=0):
    for i in range(start,len(L)):
        if L[i].startswith(prefix): return i
    raise Exception(prefix)
i_has=idx('const has=(c,x)=>c.f.includes(x),pw=')
i_chk=idx('function chk()')
i_fight=idx('function fight(){')
i_msg=idx('const msg=m=>')
head='\n'.join(L[:i_has]); mid='\n'.join(L[i_chk:i_fight]); tail=L[i_msg:]
tail=[l for l in tail if not l.startswith('const cdmg=')]
tail='\n'.join(tail)
head=rep(head,"def:0,att:0,sw:0}","def:0,att:0,sw:0,rs:0,vn:0}")
head=head.replace("const NT={spearc:1,gale:1,aegis:1,salve:1,hold:1,mist:1};\n","")
data=open(S+'data_new.js',encoding='utf-8').read()
# data patches defined in data_new.js as python-able markers
exec(open(S+'patch_data.py',encoding='utf-8').read())
exec(open(S+'patch2.py',encoding='utf-8').read())
exec(open(S+'patch3.py',encoding='utf-8').read())
exec(open(S+'patch4.py',encoding='utf-8').read())
exec(open(S+'patch5.py',encoding='utf-8').read())
exec(open(S+'patch6.py',encoding='utf-8').read())
exec(open(S+'patch7.py',encoding='utf-8').read())
exec(open(S+'patch8.py',encoding='utf-8').read())
exec(open(S+'patch9.py',encoding='utf-8').read())
exec(open(S+'patch10.py',encoding='utf-8').read())
exec(open(S+'patch11.py',encoding='utf-8').read())
exec(open(S+'patch12.py',encoding='utf-8').read())
exec(open(S+'patch13.py',encoding='utf-8').read())
exec(open(S+'patch14.py',encoding='utf-8').read())
exec(open(S+'patch15.py',encoding='utf-8').read())
exec(open(S+'patch16.py',encoding='utf-8').read())
exec(open(S+'patch17.py',encoding='utf-8').read())
exec(open(S+'patch18.py',encoding='utf-8').read())
exec(open(S+'patch19.py',encoding='utf-8').read())
exec(open(S+'patch20.py',encoding='utf-8').read())
exec(open(S+'patch21.py',encoding='utf-8').read())
exec(open(S+'patch22.py',encoding='utf-8').read())
exec(open(S+'patch23.py',encoding='utf-8').read())
exec(open(S+'patch24.py',encoding='utf-8').read())
exec(open(S+'patch25.py',encoding='utf-8').read())
exec(open(S+'patch26.py',encoding='utf-8').read())
exec(open(S+'patch27.py',encoding='utf-8').read())
exec(open(S+'patch28.py',encoding='utf-8').read())
exec(open(S+'patch29.py',encoding='utf-8').read())
exec(open(S+'patch30.py',encoding='utf-8').read())
exec(open(S+'patch31.py',encoding='utf-8').read())
exec(open(S+'patch32.py',encoding='utf-8').read())
exec(open(S+'patch33.py',encoding='utf-8').read())
exec(open(S+'patch34.py',encoding='utf-8').read())
exec(open(S+'patch35.py',encoding='utf-8').read())
exec(open(S+'patch36.py',encoding='utf-8').read())
exec(open(S+'patch37.py',encoding='utf-8').read())
exec(open(S+'patch38.py',encoding='utf-8').read())
exec(open(S+'patch39.py',encoding='utf-8').read())
exec(open(S+'patch40.py',encoding='utf-8').read())
head=head.replace('.pn{font-size:15px','.hub{display:flex;flex-direction:column;gap:12px;align-items:stretch;min-width:280px}.hub .b{font-size:17px}.b[disabled]{opacity:.4;cursor:default;box-shadow:none}.pn{font-size:15px')
out=head+'\n'+A+'\n'+mid+'\n'+B+'\n'+tail
out=out.replace("'Draft your army'","'Draft your deck'")
import re as _re
_n=[0]
def _sub(p,r):
    global out
    out,k=_re.subn(p,r,out);_n[0]+=k;print('armycap',p[:30],k)
_sub(r"(cr\([A-Za-z.]+\)\.length) ?(<=|>=|<|>) ?5\b",r"\1\2AM()")
_sub(r"(length-S\.length)<5\)",r"\1<AM())")
_sub(r"\b5-cr\(",r"AM()-cr(")
_sub(r"(cr\([a-z]\)\.length)\}/5<",r"\1}/${AM()}<")
_sub(r"Your army is full \(5 army members\)",r"Your army is full ('+AM()+' army members)")
open(sys.argv[1],'w',encoding='utf-8').write(out)
