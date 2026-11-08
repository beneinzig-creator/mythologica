# ===== balance of the new opponents (target ~33% bot win rate) =====
for _o,_n in [("D.mraid=['Cicone Raider',1,'C',2,1,","D.mraid=['Cicone Raider',1,'C',2,2,"),
("D.mskirm=['Cicone Skirmisher',2,'C',2,2,","D.mskirm=['Cicone Skirmisher',2,'C',3,3,"),
("D.mpill=['Cicone Pillager',3,'C',3,2,","D.mpill=['Cicone Pillager',3,'C',4,3,"),
("D.chief=['Ismarus Chieftain',4,'C',3,3,","D.chief=['Ismarus Chieftain',4,'C',4,5,"),
("ids('mraid:4,mskirm:3,mpill:2,chief:2,drums,burn:2,javel:2')","ids('mraid:3,mskirm:3,mpill:3,chief:2,drums:2,burn:2,javel:1')"),
("ids('oarsman:3,navig:3,phguard:3,nausi,alcinous,blackship,sails,gift:2,tide')","ids('oarsman:3,navig:3,phguard:3,nausi,alcinous,blackship,sails,gift,tide')"),
("ids('shade1:3,mourner:3,warden:2,tiresias,libation,pit,shroud,curse')","ids('shade1:3,mourner:3,warden:2,tiresias,libation,pit,shroud')"),
("D.tiresias=['Tiresias, the Seer',4,'C',1,3,","D.tiresias=['Tiresias, the Seer',4,'C',2,3,")]:
    assert head.count(_o)==1,_o
    head=head.replace(_o,_n)
_b3("if(SELF[c.id])L.push(SELF[c.id]);","if(has(c,'w')&&!c.f.includes('w'))L.push(KWL.w+' (from The Black Ship)');if(SELF[c.id])L.push(SELF[c.id]);")
