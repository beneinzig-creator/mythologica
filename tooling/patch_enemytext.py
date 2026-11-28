# v128 (patch_enemytext): every enemy-only card reads from its owner's side ("your opponent plays..."), and the
# text is trimmed: flavour lead-ins ("The neighbours muster: ...", "He eats men two at a time: ...") are dropped
# because the lore line and the myth panel already carry them. The rules themselves are unchanged.
# Convention: "you/your" is the card's owner; the other side is "your opponent" (then "they/their"), or "opposing".
# Runs after patch_owntext and the reworked opponents (foes*.js), so it wins over both.

ETX = {}
def _t(block):
    for line in block.strip('\n').split('\n'):
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        k, v = line.split('|', 1)
        assert k not in ETX, k
        ETX[k] = v

# ---------------- Odysseus's road ----------------
_t(r"""
isl|Opportunist. When it enters, your opponent's weakest untapped army member falls asleep (tapped; it doesn't untap next turn).
lot|Ruthless. Opportunist. When it deals combat damage to your opponent, a random card from their hand is shuffled back into their deck.
priest|Opportunist. When it enters, your opponent's strongest untapped army member falls asleep: it is tapped and doesn't untap next turn.
reaper|Siege. Opportunist. An army member it deals combat damage to doesn't untap next turn.
titan|Ruthless. Opportunist. It skips its next untap after attacking. At the end of your opponent's turn, they lose 1 life for each of their army members asleep (tapped without having attacked; at most 2).
sip|Tap target opposing army member; it doesn't untap next turn.
dream|Tap all opposing army members. They don't untap next turn.
censer|At the start of your turn, tap your opponent's strongest untapped army member.
garden|Your Drowsy army members get +1/+1.
fog|Tap all untapped opposing army members.
breeze|Gain 3 life.
lbow|Range. When it enters, your opponent's strongest untapped army member falls asleep (tapped; it doesn't untap next turn).
nshade|Deal 4 damage to target army member (more in later fights).
lhz|Ward. The first army member your opponent plays each turn enters tapped.
scout|Flying. When it enters, your opponent's weakest army member must attack on their next turn.
song|Flying. When it enters, draw a card.
siren|Flying. At the start of your turn, if your opponent did not attack on their last turn, it takes 2 damage.
eel|Venomous. Can only defend.
lyre|Your flying army members have Draining.
skies|Your flying army members get +1 power.
shoal|Non-flying attackers deal 1 damage to their controller.
melody|Target opposing army member switches to attack form and must attack next turn.
lure|Target opposing army member gets -2/-2.
dirge|Deal damage to your opponent equal to the total power of your flying army members.
canto|Opposing army members can't switch to defense form.
sheep|When it dies, you gain 2 life.
cscout|Ruthless. Cyclops. When it enters, it eats an opposing army member with power 1 or less.
cave|Phalanx. Cyclops. When it enters, your opponent's strongest army member is tapped and doesn't untap next turn.
brute|Ruthless. Cyclops. When it enters, your opponent's two weakest army members take 1 damage each.
elder|Resilient. Cyclops. When it dies, your opponent takes 3 damage.
poly|Attacks each turn if able. While it is untapped, opposing army members deal no combat damage to you.
hurl|Deal 4 damage to target opposing army member.
club|Your army members with power 3 or more have Bulldoze.
mouth|Opposing army members with power 1 or less can't attack.
shade1|Restless: the first time it dies, it returns to your hand.
mourner|Shade. If it drank, it can't be blocked. When it dies, draw a card.
warden|Shade. Resilient. Range. Your other Shades get +0/+1.
tiresias|Shade. When it enters, it drinks all the blood in the pit: +1/+1 and draw a card for each drop.
libation|Return the two most recent army members from your graveyard to your army.
pit|Whenever one of your army members dies, deal 1 damage to your opponent.
hdead|Ward. Whenever any army member dies, a drop of blood falls into the pit (at most 4). Whenever one of your Shades enters, it drinks a drop if there is one: +1/+1, and it speaks.
oarsman|Fleet. When it enters, restore 1 health to each of your army members.
navig|Fleet. Steadfast. When it enters, draw a card.
phguard|Fleet. Range. When it enters, your opponent's strongest army member gets -1/-0 until your next turn.
nausi|When it enters, gain 3 life.
alcinous|When it enters, restore all your army members to full health and gain 4 life.
sails|Your Fleet army members get +1 power.
gift|Gain 4 life. Restore 2 health to each of your army members.
tide|Restore 3 health to target army member.
trident|Deal 4 damage to target army member (more in later fights).
blackship|Your Fleet army members have Ward. At the start of your turn, you hold a contest (strongest army member, then most army members, then costliest). If you win, your opponent loses 2 life; if not, they draw a card.
mraid|Marauder. Charge. When it dies, another Cicone Raider is shuffled into your deck.
mskirm|Marauder. Charge. +1/+0 for each turn the fight has gone past the 4th (at most +3).
mpill|Marauder. Charge. When it deals combat damage to your opponent, a random card in their hand is destroyed.
chief|Marauder. Charge. Rally. From the fifth turn on, at the start of your turn, a Cicone Raider joins you.
drums|Your Marauders get +1 power.
burn|Deal 2 damage to your opponent for each Marauder you control.
javel|Deal 3 damage to target army member (more in later fights).
cbow|Marauder. Range. When it enters, your opponent's weakest army member takes 1 damage.
hitr|Ward. At the start of your sixth turn, two Cicone Raiders join you and your army gets +1/+0 permanently (army members that arrive later get it too).
cwolf|Ruthless. +1/+1 while your opponent has a Swine.
clion|Ruthless. When it deals combat damage to your opponent, their newest army member gets -1/-1 permanently.
cmaid|When it enters, restore 2 health to each of your army members.
circe|When it enters, tap the strongest opposing army member; it doesn't untap next turn.
cwand|Tap target army member; it doesn't untap next turn.
cdraft|Target army member gets -2/-2.
cup|Ward. At the start of your turn, if your opponent has no Swine, their strongest untapped non-token army member costing 3+ becomes a 1/1 Swine. When the Swine leaves play, the original returns to their hand, 1 cheaper.
cow|Sacred: when it dies, the Sun God's tally grows (unless you offered it).
bull|Sacred: when it dies, the Sun God's tally grows (unless you offered it).
lamp|Flying. Whenever one of your cattle dies, it gets +2/+0 permanently.
neith|Flying. When it enters, restore your cattle to full health.
scorch|Deal 4 damage to target army member (more in later fights).
sacril|Ward.
hmil|Phalanx. +1/+0 while you control Hector.
hspr|Phalanx. Range. When it blocks, it deals 1 more damage.
hgua|Phalanx. Your other Phalanx army members get +0/+1.
hchar|Charge. When it enters, your opponent's weakest army member takes 1 damage.
hector|Attacks each turn if able. When it enters, your other Phalanx army members get +1/+1 permanently.
priam|When it enters, gain 4 life.
sh1|Ruthless. When it dies, it is shuffled back into your deck.
sh2|Ruthless. +1/+0 for each other Head.
sh3|Draining. Range. When it enters, tap your opponent's weakest army member.
sh4|Venomous. When it dies, it is shuffled back into your deck.
scyl|When it enters, deal 2 damage to each opposing army member.
curse|Target army member gets -2/-2.
cdro|When it dies, it returns to your hand.
cspa|When it enters, tap target opposing army member.
ceel|When it enters, draw a card.
clev|Resilient. +2/+2 on every fourth turn.
chary|When it enters, tap all opposing army members.
undertow|Tap target opposing army member.
honey|Tap target opposing army member; it doesn't untap next turn.
""")

# ---------------- Odin's road ----------------
_t(r"""
pup|Pack. When it dies, your other wolves get +1/+0 permanently.
wolf|Pack. When it enters, a Wolf Pup joins you.
hati|Pack. Range. At the start of your turn, the opposing army member with the least health takes 1 damage.
skoll|Pack. Charge. +2/+0 while you control Hati.
fenr|Pack. Bulldoze. At the start of your turn, +1/+1 permanently. It can't attack before your sixth turn.
pgrow|Ward. At the start of every second turn of yours (starting with the first), your weakest army member gets +1/+1 permanently.
ithrl|Giant. When it dies, the winter deepens by 1.
rimew|Giant. While any Rime-Witch lives, opposing army members get -1/-0. When it enters, your opponent's weakest army member takes 1 damage for each winter. When it dies, the winter eases by 1.
hgnt|Giant. Resilient. +1/+1 for each winter.
icesp|Deal 2 damage plus 1 for each winter to target army member.
rwall|Ward. On every second turn of yours, the winter deepens (at most 2). Your Hill Giants and Ice Spears grow stronger with each winter. Whenever a Rime-Witch dies, the winter eases by 1.
dmin|Forged. When it dies, draw a card.
dsmith|Forged. At the start of your turn, if you have an item, your weakest army member gets +1/+1 permanently.
dxbow|Forged. Range. When it enters, target opposing army member takes 1 damage for each item you have (at most 3).
brokk|Forged. When it enters, draw a card. Your other Forged army members get +1/+0.
golem|Forged. Resilient. +1/+1 for each item you have.
anvl|Your Forged army members get +1/+1.
dshld|Your Forged army members have Resilient.
drpn|At the start of your turn, gain 1 extra mana.
dbolt|Deal 4 damage to target army member (more in later fights).
ffire|Ward. Whenever you play an item or modifier, your strongest army member gets +1/+1 permanently.
ember|Charge. When it dies, your opponent takes 1 damage.
fraid|Charge. When it deals combat damage to your opponent, one of their items or modifiers is destroyed; if they have none, they take 1 more.
lava|Ruthless. When it attacks, the untapped opposing army member with the least health takes 1 damage.
mgnt|Ruthless. When it attacks, it takes 1 damage and your opponent takes 1.
surtr|Ruthless. Charge. When it enters, each opposing army member with power 1 or less dies. Your other fire army members get +1/+0.
fbolt|Deal 3 damage to your opponent (more in later fights).
mspear|Deal 3 damage to target army member (more in later fights).
bland|Ward. At the start of each of your opponent's turns, they lose 1 life.
draug|When it dies, a Risen Draugr goes into your hand.
wight|Draining. +1/+1 for each Draugr in your graveyard (at most +2/+2).
hgrd|Resilient. When it dies, it drives two nails into Naglfar instead of one.
nidh|Draining. Venomous. At the start of your turn, it eats a card from your opponent's graveyard and gets +1/+1.
hgrasp|Destroy target army member that has damage on it.
corp|Ward. Whenever one of your army members dies, a nail is driven into Naglfar. At 8 nails, your army gets +2/+0 and Charge permanently (army members that arrive later get it too).
lrav|When it enters, draw a card.
imp|When it enters, swap the power and health of your opponent's strongest army member.
skinw|When it enters, it copies the power, health and keywords of your opponent's strongest army member.
lokis|When it enters, your opponent's strongest army member deals damage equal to its power to another of theirs, then returns to their hand. Draw a card.
lsnare|Tap target army member; it doesn't untap next turn.
lcurse|Target army member gets -2/-2 permanently (more in later fights).
lgale|Return target army member to its owner's hand.
lokib|Deal 1 damage to target army member for each card in your opponent's hand (at most 4).
ltax|Ward. The first spell your opponent casts each turn costs 1 more.
urd|When it enters, return a random army member from your graveyard to your hand.
verd|When it enters, tap the strongest opposing army member.
skuld|When it enters, draw a card.
nspin|When it enters, your opponent's weakest army member is doomed (-1/-1 permanently).
nwarr|Ruthless. When it dies, the costliest army member in your hand costs 1 less.
ndoom|Deal 4 damage to target army member (more in later fights).
fate|Ward.
fafn|+1/+1 for each Gold in the Hoard. Takes 2 extra damage from army members that block it.
fgrd|When it enters, add a Gold to the Hoard.
fworm|Ruthless. When it attacks, the opposing army member with the least health takes 1 damage.
regin|When it enters, draw a card. When Fáfnir dies, Regin leaves your army.
dbrth|Deal 2 damage to each opposing army member.
fspit|Deal 4 damage to target army member (more in later fights).
hoard|Ward.
jsnk|Venomous. When it dies, it is shuffled into your deck.
jcrw|Resilient. After it blocks an army member, that army member returns to its owner's hand.
jorm|It enters tapped. When it enters, destroy the costliest opposing army member that costs 4 or more (not Ward).
jbck|Return target army member to its owner's hand.
jgrp|Tap target army member; it doesn't untap next turn.
jspt|Deal 3 damage to target army member (more in later fights).
hhnd|Charge. When it enters, tap the Quarry.
hrdr|Flying. When it deals combat damage to your opponent, their weakest army member returns to their hand.
hwld|Whenever an opposing army member dies, this gets +1/+1 permanently.
hmst|Flying. Charge. Your other riders and hounds get +1/+0.
hhrn|Tap target army member; it doesn't untap next turn.
hhbt|Deal 3 damage to target army member (more in later fights).
hrung|Takes 2 less combat damage from army members without Flying.
hmokk|Takes 2 extra combat damage. Can only defend.
htrl|When it enters, your opponent's weakest army member takes 1 damage.
hgrt|When it dies, each opposing army member takes 1 damage.
hwhet|Deal 4 damage to target army member (more in later fights).
hmead|Gain 4 life. Restore 2 health to each of your army members.
""")

# ---------------- Wukong's road ----------------
_t(r"""
spd1|Flying. When it enters, put 1 silk on your opponent's strongest army member.
spd2|Ward. At the start of your turn, put 1 silk on the opposing army member with the most power that is not cocooned.
spd3|Ruthless. Your army members get +1/+0 for each cocooned opposing army member (at most +2).
spdq|At the start of your turn, it eats a cocooned opposing army member and gets +2/+2.
cocn|Target opposing army member gets 3 silk and is cocooned: it stays tapped while it has 3 silk.
cweb|Ward. Each silk gives -1/-0 (never below 0 power; at most 3 silk). At 3 silk an army member is cocooned and stays tapped. At the end of your opponent's turn, each of their silked army members that didn't attack sheds 1 silk.
hsol|Whenever the gourd swallows an opposing army member, this gets +1/+1 permanently.
hcap|While it lives, the gourd calls one more name each turn. When it dies, your Gourd of Names is destroyed.
hsil|Ruthless. When it enters, call one more opposing army member by name.
hgol|Whenever the gourd swallows an opposing army member, your opponent takes damage equal to its cost.
hrope|Each called opposing army member gets -2/-0 until your next turn, and the gourd calls one more name.
hbot|Call target opposing army member by name. If it was already called, it is swallowed now.
gourd|Ward. At the start of your turn, the gourd calls an opposing army member by name. If it attacks or blocks before your next turn, it is swallowed (gone for good).
hsd|Rank 1. When an officer dies, a soldier is promoted into its place. When it dies, another soldier is shuffled into your deck.
hhd|Rank 2. Opportunist. +1/+0 for each Heavenly Soldier you control (at most +3).
hgn|Rank 3. Ward. At the start of your turn, a Heavenly Soldier joins you.
hnz|Rank 4. Charge. When it attacks, it deals 1 damage to each of three opposing army members.
hpg|Rank 5. Resilient. While it lives, each promoted soldier also gets +2/+2, and your Nezha has Ward.
hnet|Tap an opposing army member for each Heavenly Soldier you control.
decree|Ward. The first army member that costs 2 or less your opponent plays each turn costs 1 more. When one of your officers dies, a Heavenly Soldier is promoted into its place.
rimp|Charge. Fire-cart: each one makes Red Boy's breath and the Fire-Cloud Blast deal 1 more.
rgrd|Whenever a fire-cart dies, a new Fire-Wheel Imp is shuffled into your deck.
rspr|Ruthless. An army member it deals combat damage to is set burning: it takes 1 damage at the start of each of your turns.
rboy|Charge. Ward on the turn it arrives. At the start of your turn, your opponent's strongest army member takes 1 damage plus 1 for each fire-cart.
rflm|Deal 2 damage plus 1 for each fire-cart to target army member.
sfire|Ward. At the start of your turn, your opponent takes twice the life they gained since your last turn. Army members that block yours take 1 damage first.
bsk|When it dies, your opponent gets 1 guilt and a Wandering Corpse is shuffled into your deck.
bghl|When it dies, your opponent gets 1 guilt.
bhag|When it dies, your opponent gets 2 guilt.
bsp|The first two times it dies, it returns to your hand and a Wandering Corpse takes its place. The third death is final.
bone|Ward. Killing your disguises gives your opponent guilt. At 2 guilt, their strongest army member is shuffled into their deck and the guilt clears.
ybat|Flying. Charge. When it attacks, an opposing army member is blinded: it can't block until the end of their next turn.
ytig|Charge. The first time it dies, it returns to your hand.
ydef|Charge. Blinded opposing army members get -1/-0.
ygen|Flying. Charge. When it enters, all opposing army members are blinded: they can't block until the end of their next turn. When it dies, they are all cured.
ygale|Each blinded opposing army member takes 2 damage.
ywind|Ward. Your army members have Charge.
eplum|When it becomes a predator, it also gains Flying.
ehnd|Opportunist. After it blocks an army member, that army member doesn't untap on its controller's next turn.
eerl|Resilient. While it lives, it becomes the predator of each army member your opponent plays, and also takes that army member's keywords.
esw|Deal damage to target army member equal to the power of your strongest predator.
eye|Ward. Whenever your opponent plays an army member, one of yours becomes its predator: its power becomes that army member's power +1.
iwnd|Flying. When it dies, your opponent's newest army member is blown away if it costs 2 or less.
imaid|While it lives, the fan also blows away army members that cost 2.
iguard|Phalanx. While it lives, army members the fan blows away cost 1 more to play again.
iprin|Resilient. When it enters, it blows away your opponent's two most expensive army members that cost 3 or more.
ifan|Ward. On your first, third, fifth… turn, the fan blows away your opponent's most expensive army member that costs 4 or more: three cards down in their deck.
mmon|When it enters, it copies the power and health of your opponent's newest army member.
mape|Opportunist. Whenever your opponent casts a spell, it gets +1/+1 permanently.
mear|When it enters, steal the top 2 cards of your opponent's deck.
mac6|Resilient. At the start of your turn, it gains every keyword your opponent's army members have.
mecho|Deal damage to target army member equal to the power of your opponent's strongest army member.
mtrump|Ward. At the start of your turn, take the top card of your opponent's deck. If it is an army member, a copy of it fights for you; anything else is lost.
bgrd|When it is damaged in combat and survives, it adds 2 rage instead of 1.
bcap|Ruthless. Bulldoze. +1/+0 for every 2 rage (at most +3).
bhrn|Charge. Can only attack. +2/+0 while the Bull Demon King is the white bull.
bdk|Resilient. At 4 rage it becomes the white bull: +4/+4 and Bulldoze. If the rage is already full, it arrives as the bull.
bfury|Ward. When one of your army members survives combat damage, rage grows by 1. At 4 rage, the Bull Demon King becomes the white bull. At the start of your turn, your army members get +1/+0 until end of turn.
pdis|At the start of your turn, +0/+1 permanently (at most +3).
pfin|Can only defend. While it lives, the Five-Finger Mountain's extra cost is 1 higher. At the start of your turn, this Finger takes 1 damage.
pgrd|While it lives, opposing army members that cost 4 or more are sealed and can't attack, and the Five-Finger Mountain's extra cost falls on the third card your opponent plays each turn instead of the fourth.
plm|Can only defend. Resilient. At the start of your turn, your opponent takes 3 damage.
palm|Ward. The fourth card your opponent plays each turn costs 2 more, plus 1 more for each Finger of the Mountain. Cards after it cost their normal amount. At the start of your fifth turn, The Buddha's Palm comes into play from your hand or deck.
""")

# ---------------- Thoth's road ----------------
_t(r"""
grob|Charge. +1/+0 while you have more army members than your opponent.
tdig|Can't be blocked while you have more army members than your opponent.
fence|When it enters, and at the start of your turn, if you hold stolen goods, sell one: draw a card.
mthief|Ruthless. When it enters, steal a random card from your opponent's hand. When it dies, each of your other robbers takes 2 damage.
torch|Deal 2 damage to target army member, or 4 if it is already damaged.
trob|Ward. At the start of your turn, if you control more army members than your opponent, steal a random item or modifier of theirs (or a random card from their hand) for the rest of the fight.
sbrood|Charge. When it dies, the venom pool fills by 2. When it deals combat damage to your opponent, by 1.
sstalk|After it blocks, the venom pool fills by 1.
squeen|At the start of your turn, restore 2 health to each of your army members. When the pool stings, opposing army members heal 1.
sking|+1/+1 for every 2 venom in the pool (at most +3/+3).
sting|Spend 3 venom: destroy target army member. With less venom, deal 2 damage to it instead.
serk|Ward. When one of your scorpions dies or deals combat damage to your opponent, add 1 venom. At 5 venom, your opponent's strongest army member dies, they lose 3 life, and the venom resets.
shbs|Once each turn, when another of your army members dies, this dies instead and that army member returns with 1 health.
mumw|Resilient. At the start of your turn, restore it to full health.
embp|When it enters, restore all your army members to full health. Your Shabti get +1/+1 permanently.
tguard|Your Shabti get +1/+1. At the start of your turn, a Shabti joins you.
heal2|Gain 4 life. Restore 2 health to each of your army members.
shab|Ward. The first time each of your non-token army members dies, a 1/1 Shabti takes its place.
croc|+1/+0 (+2/+0 in defense form), and +1/+1 for each army member held in the river (at most +2/+2).
lurk|When it blocks an army member with 3 or less health left, that army member is dragged into the river before it can strike.
sobpr|Your army members get +1/+0 for each army member held in the river (at most +3).
sobek|When it blocks an army member, that army member is dragged into the river before it can strike. +1/+1 for each army member held in the river. When it dies, they all return to their owner's hand.
drag|A damaged opposing army member is dragged into the river.
sobk|Ward. Opposing army members dragged under are held in the river, not killed. When Sobek dies, they return to their owner's hand.
jack|Charge. +1/+0 for each claimed soul you hold (at most +3).
jguard|Whenever you claim a dead opposing army member, this gets +1/+1 permanently and you gain 1 life.
wepw|Ruthless. When it attacks, the other attackers can't be blocked this turn.
jpack|When it enters, and at the start of your turn, lead one claimed soul into the Hall for good: your Jackals get +1/+1 permanently.
anub|Ward. When an opposing army member dies, you claim it: it goes to your graveyard, not theirs.
hekp|When it enters, a random card in your opponent's hand is cursed: it costs 1 more for the rest of the fight.
snake|Venomous. Whenever your opponent plays a cursed card, they take 2 damage.
hekmag|When it enters, destroy a cursed card in your opponent's hand.
hekhigh|Ward. At the start of your turn, another card in your opponent's hand is cursed.
curse2|Target army member gets -2/-2, or -3/-3 if your opponent holds a cursed card.
heka|Ward. At the start of your turn, a random card in your opponent's hand is cursed.
ammit|Can only defend. Each heart it eats gives it +2/+2.
soulw|When it dies, the feather becomes 1 lighter (at most 2 lighter).
unwor|When it deals combat damage to your opponent, their strongest army member gets +1/+0 permanently (a heavier heart).
hguard2|The feather is 1 lighter while it lives.
ammt|Ward. At the start of your turn, your opponent's army member with the most power is weighed against the feather (power 5, lighter for each Guardian of the Scales). If it is heavier, Ammit eats it (gone for good).
sphinx2|It can only defend until your opponent fails a riddle. Each failed riddle gives it +1/+1.
sphg|Flying. Your other army members get +0/+1.
sphs|Can only defend. Each riddle your opponent fails gives it +1/+1.
sphx|Ward. At the start of your turn, the Sphinx names a card type. At the end of your opponent's turn, if they played that type, they draw a card; if not, they lose 2 life.
apepx|Venomous. When it enters, opposing army members are tapped and don't untap next turn. When it dies, it is shuffled into your deck.
apsp|When it dies, a new Spawn of Apophis is shuffled into your deck.
apcoil|After it blocks an army member, that army member is Erased: it loses its name, keywords and abilities.
setg|Ruthless. When it attacks, it first fights your opponent's strongest army member: each deals damage equal to its power to the other.
setb|Charge. When it deals combat damage to your opponent, their weakest army member is Sundered (they get no Name).
setst|At the start of your turn, each opposing Body and Spirit takes 1 damage.
sand|Deal 2 damage to each opposing army member.
sekhg|Whenever an opposing army member dies, it gets +1/+0 permanently. Whenever your opponent gains life, it falls asleep (tapped; it doesn't untap next turn).
lion|Ruthless. +1/+0 for each other Lioness (at most +2).
plague|When it enters, each opposing army member takes 1 damage. At the start of your turn, gain 1 life.
""")

# ---------------- Act III ----------------
_t(r"""
xlgn|+1/+0 for each possessed army member you control (at most +2).
xger|At the start of your turn, your opponent's cheapest army member (cost 2 or less, not Ward) is possessed and fights for you. Only one is possessed each turn, however many Gerasenes you have.
xswn|Whenever a possessed army member dies, +1/+1. When it dies, every possessed army member is freed and returns to its owner.
xlegc|When it enters, possess your opponent's strongest army member that costs 3 or less. +1/+1 for each possessed army member you control.
xcast|Deal damage to target army member equal to 2 + the number of possessed army members you control.
xlegion|Ward. Possessed army members fight for you. When a possessed army member dies, it goes to its owner's graveyard. The Herd of Swine can free them.
xwat|Flying. +1/+0 for each card in your hand beyond 2 (at most +2).
xchrm|When it enters, one of your army members gains Flying.
xkok|Flying. When it enters, draw 2 cards.
xsemj|Flying. Whenever another of your army members dies, your other army members get +1/+1.
xcurse|Target army member gets -1/-1 for each card in your hand (at most -3/-3).
xwatch|Ward. Whenever your opponent casts a spell, draw a card (at most 1 a turn).
xyneph|At the start of your turn, if your opponent holds 3 or more cards, it eats one at random and gets +1/+1.
xnep|When it enters, it eats your weakest other army member and gains its power and health.
xgib|Bulldoze. Whenever one of your army members is eaten, this gets +1/+1.
xog|Resilient. +1/+1 for each Nephilim in your graveyard (at most +4/+4).
xroar|Tap each opposing army member with power 2 or less. They don't untap next turn.
xclub|Deal damage to target army member equal to the power of your strongest army member.
xneph|Ward. Your army members that cost 3 or more cost 1 less.
xfire|At the start of your turn, it gets +2/+0 permanently.
xcult|When it attacks, it gets +2/+0 this turn.
xidol|Can only defend. At the start of your turn, each of your other army members gets +1/+0 permanently, and you lose 1 life.
xmolp|Ruthless. Whenever another of your army members dies, draw a card and your army gets +1/+0 permanently.
xflame|Each of your army members gets +2/+0 this turn, and you lose 2 life.
xmol|Ward. Whenever one of your army members dies or is offered, your other army members get +1/+0 permanently.
xbrick|At the start of your turn, the tower rises by 1.
xmason|When it enters, the tower rises by 2. +1/+1 for every 3 floors of the tower.
xzigg|Can only defend. Whenever another of your army members dies, the tower rises by 1.
xnim|Ruthless. At the start of your turn, your opponent takes 1 damage for every 3 floors of the tower.
xtong|Shuffle the costs of the cards in your opponent's hand and tap their strongest army member. The tower falls by 1.
xbab|Ward. At the start of your turn, the tower rises by 1. At 12 floors, it falls back to 6.
xstar|Flying. Charge. It dies at the end of your turn. When it dies, your opponent's next draw is lost.
xench|When it enters, your opponent's next draw is lost.
xmush|Flying. Charge. When it enters, your opponent gets 1 less mana on their next turn.
xdroug|Your opponent gets 1 less mana each turn (never below 1).
xglam|Until your next turn, target army member has 0 power.
xpair|Ward. Whenever your opponent offers an army member, each Pairika takes 1 damage.
xline|+0/+1 for each other Son of Darkness (at most +3).
xsling|Range. When it enters, target opposing army member takes 1 damage for each Son of Darkness you control (at most 3).
xcapt|Your other Sons of Darkness get +1/+0.
xbelg|At the start of your turn, your opponent's strongest army member gets -1/-1 permanently.
xjav|Deal damage to target army member equal to 1 + the number of Sons of Darkness you control (at most 5).
xbel|Ward. On your turns 1, 3 and 5, your army members get +0/+2; on turns 2, 4 and 6, +2/+0; on turn 7, -2/-2. Then the cycle repeats.
xcoin|When it enters, your opponent gets 1 more mana from Mammon next turn.
xhoard|+1/+1 for each mana your opponent left unspent last turn (at most +3/+3).
xmerc|Charge. Whenever your opponent ends a turn with 2 or more mana unspent, it gets +1/+1 permanently.
xmamg|+1/+1 permanently for each mana your opponent leaves unspent. When it dies, your opponent stops gaining Mammon's mana.
xbribe|Return target opposing army member to its owner's hand; Mammon pays them its cost in mana next turn.
xmam|Ward. Your opponent gains 1 extra mana each turn. At the end of their turn, each mana they spent gives one of your army members +1/+1 permanently, and they lose 1 life per unspent mana.
xacc|Flying. Each opposing army member that attacks adds 1 more to the ledger.
xtenth|When it enters, a 1/1 Spirit joins you. When it dies, the ledger grows by 3.
xtempt|Your opponent's spells cost 1 less, and each spell they cast adds 2 to the ledger.
xmastg|Flying. While it lives, the ledger costs your opponent 1 life for every 2 points instead of 3.
xtest|If the ledger holds 5 or more, destroy target opposing army member. Otherwise it takes 2 damage.
xmast|Ward. Every point of damage your opponent's army deals is written in the ledger. At the start of your turn, they lose 1 life for every 3 points (every 2 while Mastema lives), and the ledger clears.
xher|Each Herald gives you 1 extra mana a turn; the third to arrive brings King Paimon.
xlegs|+1/+1 for each Herald you control (at most +3/+3).
xdrom|Charge. +2/+2 while you control King Paimon.
xpaimon|When it enters, each of your army members gets +1/+1 permanently.
xsecr|Draw a card for each Herald you control (at most 3).
xpaim|Ward. Each Herald gives you 1 extra mana at the start of your turn. Once three Heralds have arrived, King Paimon comes from your deck.
xbeelg|Flying. Your Flies get +1/+0. Whenever one of your Flies dies, your opponent takes 1.
xbaal|At the start of your turn, a Fly joins you.
xcarr|Whenever any army member dies, +1/+0 (at most +3).
xzebul|Can only defend. Shared damage never lands on it, and your Flies get +0/+1.
xpraer|Flying. When it enters, two Flies join you.
xdung|Whenever your opponent offers an army member, a Fly joins you.
xplague|Deal 1 damage to each opposing army member for every two Flies you control.
xbeel|Ward. Combat damage dealt to one of your army members is shared, 1 point to each of your others (Flies first), before the rest lands. If you have only one army member, it takes double damage.
xazag|Can only defend. At the start of your turn, one of your army members gets +2/+0 permanently.
xsmith|When it enters, your strongest other army member gets +2/+0 permanently.
xgoat|Can only defend. The first damage each turn dealt to another of your army members is dealt to it instead.
xadorn|When it enters, your strongest other army member gains Ward.
xsword|When it enters, each of your army members gets +1/+0 permanently.
xdudael|Tap your opponent's strongest army member. It stays tapped for two turns.
xaza|Ward. Whenever one of your army members dies, your opponent's strongest army member takes 2 damage.
xasmg|Ruthless. +1/+0 for each pair of opposing army members that share a cost. If an opposing spell damages it, it is shuffled into your deck.
xjeal|Whenever your opponent plays an army member that shares a cost with one they already have, this gets +1/+1 permanently.
xwrath|Can only attack. When it dies, each opposing army member that shares a cost with another takes 1 damage.
xdesire|When it enters, the cheapest army member in your opponent's hand now costs the same as their newest army member.
xgroom|Whenever Jealousy strikes, this gets +1/+1 permanently for each pair it hits.
xfeast|Each opposing army member that shares a cost with another takes 2 damage.
xashm|Ruthless. +1/+1 for each pair of opposing army members that share a cost.
xasm|Ward. At the start of your turn, for each pair of opposing army members that share a cost, the newer one takes 2 damage.
xlilg|Draining. At the start of your turn, each opposing army member that arrived since your last turn takes 2 damage.
xlilin|Flying. When it deals combat damage to your opponent, their newest army member takes 2 damage.
xowl|Flying. When it enters, your opponent's newest army member is tapped and doesn't untap next turn.
xdemon|When it enters, your opponent's newest army member takes 2 damage.
xcradle|Flying. When it deals combat damage to your opponent, their newest army member returns to their hand.
xnight|Your army members keep their night power (+1/+0) on your opponent's turn as well.
xamulet|Destroy target opposing army member that arrived this turn or last, if it has 3 or less health left.
xlil|Ward. Your army members get +1 power during your turn. Whenever an opposing army member dies, gain 2 life.
xlucg|Flying. Ward. Your Fallen Angels get +1/+1. At the start of your turn, it gets +1/+0 permanently.
xfang|Flying. +1/+1 for each Bargain your opponent has accepted (at most +3/+3).
xpride|Ward. Can't be blocked. When it attacks, it takes 1 damage.
xspear|Deal damage to target army member equal to 2 + the number of Fallen Angels you control.
xfall|Target opposing army member loses all its permanent bonuses and is tapped.
xdrag|Ward. Three Heads of the Dragon wait in your deck, and each Fallen Angel you gained grew stronger.
xahri|At the start of your turn, your opponent's strongest army member gets -1/-1 permanently for each Lie they hold (at most 3).
xdaeva|When it enters, a Lie goes into your opponent's hand.
xcook|When it enters, your opponent gains 2 life, and two Lies are shuffled into their deck.
xzah|Venomous. At the start of your turn, it deals 2 damage to your opponent's weakest army member (or to them, if they have none). When it dies, it returns to your hand.
xassa|Ward. Whenever an opposing army member dies, a 1/1 Khrafstra with Venomous joins you.
xapol|Flying. At the start of your turn, each damaged opposing army member takes 1 more damage.
xkeep|At the start of your turn, if you have fewer than 3 Locusts, a Locust joins you. When it dies, two Locusts join you.
xcharg|Charge. When it attacks, each Locust gets +1/+0 this turn.
xloc|Flying. When it deals combat damage to your opponent, their weakest army member gets -1/-0 permanently.
xsting|Target damaged army member gets -2/-0 permanently and can't block this turn.
xtorm|Ward. Your Locusts get +1/+1 and Venomous. At the start of your opponent's turn, each of their damaged army members takes 1 more damage.
xbeast|It and its Heads can't be Sundered.
xhb|Your other Heads get +1/+0. Can't be Sundered.
xhd|Ward. Can't be Sundered. Your opponent's spells cost 1 more while it lives.
xhl|Ruthless. Can't be Sundered. When it dies, your other Heads get +1/+1.
ximg|At the start of your turn, if no opposing army member is marked, your opponent takes 2 damage.
xfheav|Deal 2 damage to target army member and mark it: it can't attack during its owner's next turn.
xdhead|When it enters, each opposing army member takes 1 damage.
shabt|Token.
xpos|Token.
xspir|Token.
xfly|Flying. Token.
""")

import json as _json
_JSET = r"""
/* ===== v128 (patch_enemytext): enemy cards read from their owner's side, trimmed ===== */
{const T=__ETX__;for(const k in T)if(D[k]){D[k][6]=T[k];if(TXT[k])TXT[k]=T[k]}}
""".replace('__ETX__', _json.dumps(ETX, ensure_ascii=False))
_b3("showChars();\n</script>", _JSET + "showChars();\n</script>")
