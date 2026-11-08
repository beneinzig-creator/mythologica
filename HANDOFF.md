# MYTHOLOGICA — Developer Handoff

Written 2026-11-08. Current build: v97 of the published single-file game, also called `odysseus-act1.html` (about 270 KB).
Owner and designer: Ben. These notes collect every design decision made so far. Where a decision was reversed, the final ruling is given and the old one is noted.

---

## 1. Overview

**Concept.** Mythologica is a roguelike deck-builder. It uses Slay the Spire's run structure (draft a deck, walk a map, fight, upgrade, fight a boss) with combat inspired by pre-2005 Magic: The Gathering. Combat is a duel against an AI that plays a real deck and makes its own decisions. Enemies do not telegraph their moves. Cards, art direction and lore come from real mythology. Each playable hero comes from one mythology, called a "realm".

**Hook / pitch.** "A Spire-like with Magic combat." It is a battle between armies:
- Mana comes from sacrificing ("offering") your own army members to the gods.
- Army members switch between attack and defense form.
- Damage stays on a creature between turns.
- Tapped units can be attacked directly.
- Every enemy has a "trump", a signature rule-bending mechanic.

**Platform / tech.**
- One self-contained HTML file: inline CSS and vanilla JS, no framework, no external assets.
- Art is emoji for now.
- Hosted as a claude.ai artifact, but it runs from any static file.
- Desktop (tuned for a MacBook) and landscape phone. Portrait phone support was dropped.
- Permanent dark mode. The background colour follows the current opponent.
- The run autosaves to localStorage under key `mythologica_run_v1`. It only saves in safe phases: map, location, hub, draft and remove.

**Current state (v97).**
- Three playable heroes:
  - Odysseus (`ody`, Greek): 4 staples + 76-card pool.
  - Odin (`odin`, Norse): 4 + 74.
  - Sun Wukong (`wukong`, Chinese): 4 + 80, exactly 20 of each rarity.
- Each hero has 6 regular enemies, 2 elites and 3 bosses.
- Act 1 is the hero's home realm.
- Act 2 is a random other hero's realm, with scaled enemies and that realm's bosses.
- Winning the Act 2 boss ends the run with a victory screen. Act 3 and Act 4 do not exist yet.
- Friends playtest it. As of the last report, nobody had won a full run, and Ben was happy with the difficulty.

---

## 2. Core rules

**Players.**
- You have 20 max life, for every hero. Life can never go above max.
- Act 1 regular enemies have base life 15, then fight scaling is applied (section 7).
- Elites have 13–21 life. Bosses have 20–24.
- Win a fight by bringing the enemy to 0 life. Lose the run if you reach 0 life.

**Fight setup.**
- Your library is shuffled and you draw 4.
- A regular or elite enemy starts with its mini-trump card in hand plus 3 drawn cards.
- A boss draws 4. Its trump is already on its battlefield from turn 1 and has Ward, so it cannot be removed.

**Draw.** You draw 1 card at the start of each of your turns (Wukong has some extra draw hooks). An empty library just stops drawing; there is no damage for drawing from an empty library. Enemies never reshuffle, so small enemy decks can run out of cards (see section 12).

**Mana.**
- Mana refills to exactly **2** at the start of every turn. There are no lands.
- Unspent mana is lost, unless you control **Divine Karma** (Legendary modifier), which carries it over.
- Card costs are unchanged by the base mana. History: mana used to be Hearthstone-style ramping, then a fixed 3, and finally a fixed 2 so that offering matters more.

**Offering (sacrifice).**
- Every army member has a 💀 sacrifice value.
- During your main phase you may offer (sacrifice) your own army members to gain mana equal to their 💀.
- Many cards trigger "when it dies or is offered" or "each time you offer".
- The AI should offer only when it is ideal: a creature that is about to die (damaged, 1 health left), or a weak body that pays for a much stronger card.
- End-step offering: when an until-end-of-turn effect ends, an army member that would die (see the next rule) can be offered first. The AI does this too.

**Temporary buffs (final rule).**
- When a "+X/+X until end of turn" buff ends, the creature keeps whatever health it has left.
- Example: a 3/3 buffed to 6/6 that took 3 damage ends the turn as a 3/3 with 3 health. Lethal damage while buffed still kills.
- This replaced an earlier rule where the buff's expiry could kill the creature. That change was made without rebalancing.

**Army members.**
- A side can have at most **5** army members at once (`AM()`). In Hrungnir's Holmgang duel the cap is 2.
- Army members enter in **attack form** with **fatigue** (formerly called summoning sickness): they cannot attack the turn they arrive unless they have Charge.

**Forms (stances).**
- **Attack form**: the normal form; it can attack.
- **Defense form**: +2 health and it cannot attack.
- Switching is free, once per turn, and only before you declare attacks. A creature that attacked this turn cannot enter defense form.
- Card text says "while in attack form" / "while in defense form". Phalanx creatures get +2 power in defense form.
- The AI uses stances strategically.

**Tapping.**
- Attacking taps a creature (except with Steadfast). A tapped creature cannot attack or block until it untaps at the start of its controller's turn.
- "Doesn't untap next turn" sets a freeze counter (`frz`).

**Attacking tapped units (Ben's own mechanic).**
- When you attack, each attacker may target either the enemy player or one tapped opposing army member, a bit like attacking planeswalkers in Magic.
- This gives counterplay against big threats and rewards defending and attacking selectively.
- An attacker that targets an army member deals 1 less damage, and the card says so. Siege removes the penalty: the attacker deals full power.
- A tapped flyer can only be targeted by flying attackers.
- The AI uses this mechanic.

**Combat.**
- The attacker declares attackers, choosing each one's target if it has a choice.
- The defender then assigns blockers, one blocker per attacker. Blockers line up visually with the attacker they block.
- Quick spells can be cast during combat. A "Resolve combat" button ends the block step.
- Unblocked attackers hit their target. Blocked attackers trade damage with their blocker.
- Flying attackers can only be blocked by flyers or creatures with Range.

**Damage persists.**
- Damage on army members stays until healing removes it. Nothing heals automatically at end of turn. The hover pop-up says "Wounded: N damage. Only healing cards restore it."
- Every deck has some healing cards. For Odin, healing deliberately never rivals the life he loses.

**Quick-spell window on the enemy's turn.**
- During the enemy turn a "Use quick spell" button pauses the AI.
- The enemy waits 3 seconds between actions; the Norns elite waits 5 seconds. Each quick spell resets that timer to 3 seconds.

**Enemy reveals.**
- When the enemy plays any non-army card, it is shown full-screen and waits for you to press OK.
- For the Norns, foretold cards are revealed both when foretold and when played.

**Turn flow.**
- Main phase:
  - Play cards and offer army members.
  - Switch stance (before attacking).
  - Declare attacks with the "Attack (n)", "Attack with all" and "End turn" buttons.
- After attacking, the turn auto-ends if you have nothing else you can do.
- Attacking or attack-selected army members slide toward the opponent; tapped ones slide back.

**Undo.** A one-step undo works in combat only, and it can undo an attack declaration.

**Odin's Blood Price.**
- Once per turn, Odin may pay life for +1 mana (`bloodPrice()`).
- The first payment in a fight costs 2 life, then 3, then 4, and so on. The escalation is tracked per fight in `G.e.bpn`.
- You cannot pay if it would kill you.

**Wounded.** You are Wounded while your life is at half your max or less (10 or less at 20 max life). Wounded effects switch on and off as your life changes.

**Carve N.** An additional cost: pay N life to cast the card. You can't Carve if it would leave you at 0 life. Rune-Carver reduces Carve by 1.

**Momentum (Wukong).**
- Every Wukong card has a type: **Strike**, **Trick** or **Leap**. Some count as "Any type".
- Momentum rises by 1 each time you play a card whose type differs from the card you played just before it.
- It resets at the start of each of your turns.
- Many cards also count "cards played this turn".

**Disintegrate.** After the card is played it is removed from the game for the rest of the fight instead of going to the graveyard. Graveyard effects such as Cloud Somersault cannot bring it back.

**Fallen.** Your army members that died or were offered this fight. Valhalla cards count them.

**Run loss / win.**
- 0 life ends the run. "New run" and "Copy run report" buttons appear.
- Beating the Act 1 boss starts Act 2. Beating the Act 2 boss gives the victory screen.

---

## 3. Keywords and mechanics (exact in-game text)

Single-letter codes are the flag characters in `D[id][5]`.

- **Ruthless** (`r`): it gets +1 power when it attacks. Odysseus's "Raiders" are the Ruthless creatures.
- **Flying** (`f`): only flying army members (or Range) can block it, and only flyers can attack a tapped flyer.
- **Bulldoze** (`b`): when it is blocked, damage beyond the blocker's remaining health hits the defending player.
- **Venomous** (`v`): any damage it deals to an army member destroys it.
- **Draining** (`d`): its controller gains life equal to the damage it deals.
- **Charge** (`h`): it can attack the turn it arrives.
- **Steadfast** (`s`): it does not tap when it attacks, so it can still block.
- **Ward** (`w`): opposing spells, abilities and attacks cannot target it. All trump cards have Ward.
- **Siege** (`x`): it deals its full power to army members it attacks, ignoring the -1 for targeting a tapped unit.
- **Resilient** (`z`): the first time it would be destroyed, it survives with 1 health instead. This also saves it from Venomous.
- **Rally** (`y`): when it attacks, the other attackers get +1 power.
- **Sentinel** (`k`): it can only defend; it cannot attack. Card text: "Can only defend."
- **Berserker** (`n`): it can only attack; it cannot block. Card text: "Can only attack."
- **Opportunist** (`q`): +1 power for each tapped opposing army member (up to 3).
- **Range** (`a`): it can block flying army members. It was added so that every opponent has an answer to big flyers.
- **Bloodlust** (`u`, Odin): while it has damage on it, it gets +2 power.
- **Battle-rage** (`i`, Odin): while its controller is Wounded, it gets +2 power.
- **Pack** (`j`, Fenrir's Brood): +1 power for each other Pack army member you control (up to +2).
- **Forged** (`t`, Dwarven Forge): +1/+1 for each item and modifier you control (up to +3).
- **Fleet** (`l`, Phaeacians): +1/+1 for each other Fleet army member its controller controls, up to +3/+3.
- **Phalanx** (`p`): +2 power while in defense form. It is also the Phalanx archetype tag.
- **Offering** (`o`): a creature built to be offered; Offering cards such as the Ossuary reward it.
- **Shade** (`e`), **Marauder** (`m`), **Cyclops** (`g`), **Giant** (`c`): tribe tags for enemy archetypes. Giants are what Rimewall affects.
- **Restless** (card text): the first time it dies, it returns to its owner's hand.
- **Frenzy** (glossary): each time you offer an army member, its controller deals 1 damage to the opponent (per Frenzy source).
- **Disintegrate**, **Momentum**, **Wounded**, **Carve**, **Fallen**: defined in section 2.
- **Quarry** (Wild Hunt): see that boss.
- **Prestige**: the label for permanent upgrades a card has earned. It appears on the card's pop-up as "Prestige: +1 power, Gains flying…".
  - Prestige comes from the post-fight glory step (internally `kleos`): every army member that survived the fight is offered 2 random upgrades, and you pick 1.
  - It also comes from the Altar upgrade.
  - Upgrade options (`KO`): +1 power; +2 health; costs 1 less (only if cost > 1); +1 sacrifice value; gains flying (only if it lacks it); draw a card when cast; stronger effect (spells, scaled via `UPS`); gains Bulldoze, Venomous, Draining, Charge, Steadfast, Ward, Siege, Rally, Resilient, Ruthless, Opportunist or Range.
  - History: this used to be called Kleos/glory.
  - Legendary army members can still be upgraded by surviving a fight, but Legendary cards can't be duplicated or upgraded at an Altar.

**Hover / text conventions.**
- Hovering a card shows a pop-up beside it (above it for hand cards). The pop-up starts with the card type and what the type means, then every keyword's definition, the card's archetype (only in the pop-up, never on the card face), and any active modifications.
- Card faces show only abilities that actively do something.
- Changed stats show green when higher than default and red when lower.
- The type line shows a short lore phrase (e.g. "Human shield-bearer", "Plant monster") instead of "Creature".
- Rules text uses "army member" and "opponent's army member". Never "creature".

---

## 4. Card types

`D[id][2]`: `C` army member, `I` quick spell, `S` spell, `E` modifier, `A` item.

- **Army member** (`C`): stays on the battlefield, attacks and blocks, keeps its damage until healed, and has a 💀 sacrifice value.
- **Quick spell** (`I`, Magic's "instant"): a one-time effect, castable on your turn or during combat, including the enemy's turn via the quick-spell button.
- **Spell** (`S`, Magic's "sorcery"): a one-time effect, only on your own turn and outside combat.
- **Modifier** (`E`, Magic's "enchantment"): stays on the battlefield and changes the rules while it is there.
- **Item** (`A`, Magic's "artifact"): stays on the battlefield and keeps working. Some items tap to use (Bow of Odysseus, Mjolnir, Tiwaz, Rune of Eir).

Items and modifiers sit in a column on the right of each battlefield and can be destroyed (Hephaestus' Hammer, Trojan Sapper, Volund the Smith…).

**Tokens:**
- Greek Soldier `sold` 2/3.
- Einherjar `ein` 3/3.
- Swine `swine` 1/1 (Circe).
- Spare Hair `whair`: 0-cost spell. "Deal 1 damage to target opposing army member or the opponent. Disintegrate."
- Peach of Immortality `wpeach`: 0-cost spell. "Gain 1 mana. Draw a card. Disintegrate."
- Weight of the Mountain `wwt`: 9 cost, cannot be cast. A dead card shuffled into the enemy library.

**Rarity** (`RAR[id]`): C Common, U Uncommon, R Rare, L Legendary. It is shown under the mana cost, top right of the card.

---

## 5. Heroes

**Rules common to every hero:**
- 20 max life.
- Starting deck of 15 cards: 4 fixed staples plus 11 draft picks.
- In the starting draft, each round shows 3 cards and you pick 1.
- An archetype is shown only in the hover pop-up. Each synergy card belongs to exactly one archetype; generic cards have none.

Design rules Ben set for pools:
- Three fully fleshed-out archetypes per hero, plus a few generic cards. Ben first tried 4–5 archetypes and found too few synergies.
- Uncommon modifiers and items that buff an archetype, plus synergistic commons.
- Each archetype has at least three cards costing 4 or more.
- Fewer, more impactful army members. The average army size per side should be about 2.5.
- Synergistic and unsynergistic drafts must both be possible.
- Final target: about 80 cards per hero, with equal counts of each rarity (20/20/20/20). Only Wukong is there.

Card line format below: Name `id` — cost, type, power/health 💀sacrifice [rarity]. Keywords. Text.

### 5.1 Odysseus (`ody`) — Greek, home realm "the strait"

In-game blurb: "Offer cheap bodies for mana to trade up into bigger threats. His three archetypes are built to work together: Phalanx walls hold the line while Raiders strike, and Offerings turn fallen and sacrificed army members into mana, cards and damage. The best runs blend all three."

**Archetypes:**
- **Phalanx** (`P`): defense-form walls, auras for defense form, +2 power in defense, healing (Hearth, Army Surgeon), and Resilient. Wins by making attacks into it a losing trade, then turning big defenders into attackers.
- **Raiders** (`R`): Ruthless, Charge, Rally and Bulldoze aggression. Payoffs that scale with the number of Raiders (Spoils of War, Sack of Ismarus, Charge of the Amazons).
- **Offerings** (`O`): high-💀 bodies with "when it dies or is offered" triggers, plus engines (Votive Altar, Altar of Zeus, Eternal Pyre, Hades) and graveyard finishers (Requiem).

Pool size: 76 = 27 Common, 27 Uncommon, 15 Rare, 7 Legendary. By archetype: Offerings 21, Phalanx 19, Raiders 15, Generic 21.

STAPLES (always in the starting deck):
- Ithacan Spearman `spear` — 1 mana, Army 1/3 💀1 [Common]. Phalanx
- Sailor of the Fleet `sailor` — 1 mana, Army 2/2 💀1 [Common]. Ruthless
- Spear Cast `spearc` — 2 mana, Quick spell [Uncommon]. Deal 3 damage to target army member.
- Aegis Blessing `aegis` — 2 mana, Quick spell [Common]. Target army member gets +2/+2 until end of turn.

DRAFT POOL (76 cards):

Phalanx (19):
- Argive Sentinel `sent` — 2 mana, Army 1/5 💀1 [Common]. Phalanx, Can only defend
- Argive Hoplite `hopl` — 3 mana, Army 3/4 💀2 [Common]. Phalanx
- Gatekeeper of Mycenae `gate` — 3 mana, Army 2/6 💀2 [Uncommon]. Phalanx, Can only defend
- Ajax the Great `ajax` — 4 mana, Army 3/9 💀3 [Rare]. Phalanx, Resilient
- Rampart of Troy `rampart` — 1 mana, Modifier [Common]. Your army members in defense form get +1 health.
- Phalanx Doctrine `doct` — 2 mana, Modifier [Common]. Your army members in defense form get +1 power.
- Hearth of Ithaca `hearth` — 2 mana, Item [Common]. At the start of your turn, restore 1 health to each of your army members.
- Aspis Wall `wall` — 3 mana, Modifier [Uncommon]. Your Phalanx army members get +1/+1.
- Shield of Achilles `shield` — 3 mana, Item [Rare]. Your Phalanx army members have Resilient.
- Athena's Owl `owl` — 2 mana, Army 1/2 💀2 [Common]. Flying, Phalanx
- Iris `iris` — 2 mana, Army 1/2 💀1 [Common]. Flying, Steadfast, Phalanx
- Hoplite Captain `capt` — 4 mana, Army 4/5 💀2 [Uncommon]. Phalanx
- Argive Peltast `peltast` — 2 mana, Army 2/2 💀1 [Common]. Phalanx, Steadfast
- Army Surgeon `medic` — 2 mana, Army 1/3 💀1 [Common]. Phalanx. When it enters, restore 3 health to each of your army members.
- Taphian Pikeman `pikeman` — 3 mana, Army 2/5 💀2 [Uncommon]. Phalanx, Ward
- Marathon Veteran `veteran` — 3 mana, Army 3/3 💀2 [Uncommon]. Phalanx, Resilient
- Leonidas, King of Sparta `leon` — 4 mana, Army 4/6 💀3 [Legendary]. Phalanx, Resilient. Your other Phalanx army members get +2/+2.
- Last Stand at Thermopylae `thermo` — 4 mana, Modifier [Legendary]. Your Phalanx army members get +2/+2. In defense form they get +2/+2 more and have Resilient.
- Brasidas, Spartan General `brasidas` — 3 mana, Army 2/5 💀2 [Rare]. Phalanx. When it enters, your Phalanx army members get +1/+1 permanently.

Raiders (15):
- Thessalian Rider `thess` — 2 mana, Army 2/2 💀1 [Common]. Charge
- Berserker of Ares `zerk` — 2 mana, Army 3/3 💀1 [Uncommon]. Ruthless, Can only attack
- Agamemnon `agam` — 3 mana, Army 3/4 💀2 [Rare]. Rally, Charge
- Achilles `achil` — 4 mana, Army 5/5 💀3 [Rare]. Ruthless, Bulldoze
- Banner of the Argives `banner` — 3 mana, Item [Uncommon]. Your Raiders get +1 power.
- Spear of Ares `ares` — 3 mana, Item [Rare]. Your Raiders have Bulldoze.
- Helios, the Sun `helios` — 4 mana, Army 5/5 💀3 [Uncommon]. Flying
- Nike `nike` — 3 mana, Army 2/2 💀2 [Uncommon]. Flying, Draining, Ruthless
- Diomedes the Bold `dio2` — 4 mana, Army 4/3 💀2 [Uncommon]. Ruthless, Charge
- Cicone Corsair `corsair` — 1 mana, Army 2/1 💀1 [Common]. Ruthless, Charge
- Harbor Harrier `harrier` — 2 mana, Army 2/3 💀1 [Common]. Ruthless, Rally
- Venomous Reaver `reaver` — 3 mana, Army 2/3 💀2 [Uncommon]. Ruthless, Venomous
- Siege Ram Crew `ram` — 3 mana, Army 4/4 💀2 [Uncommon]. Ruthless, Siege
- Penthesilea, Amazon Queen `pent` — 4 mana, Army 5/4 💀3 [Legendary]. Ruthless, Charge. Your other Raiders have Charge and get +1 power.
- Eurylochus, Raid Captain `eury` — 3 mana, Army 4/3 💀2 [Rare]. Ruthless, Charge. When it enters, your other Raiders get +1/+1 permanently.

Offerings (21):
- Camp Follower `camp` — 0 mana, Army 1/1 💀1 [Common]. Offering. Costs nothing. Meant to be offered.
- Sacred Ox `ox` — 1 mana, Army 1/2 💀3 [Common]. Offering. Meant to be offered.
- Faithful Argus `argus` — 1 mana, Army 1/2 💀1 [Common]. Offering. When it dies or is offered, draw a card.
- Pythia of Delphi `pythia` — 2 mana, Army 0/3 💀1 [Common]. Offering. When offered, gain 2 extra mana.
- Telemachus `telem` — 2 mana, Army 1/2 💀1 [Uncommon]. Offering. Each time you offer another army member, he gets +1/+1 permanently.
- Cassandra `cass` — 3 mana, Army 2/4 💀2 [Uncommon]. Offering. When it dies or is offered, deal 3 damage to a random opponent's army member.
- Votive Altar `altar` — 2 mana, Item [Rare]. Each time you sacrifice an army member, gain 1 extra mana.
- Altar of Zeus `zeus` — 1 mana, Item [Rare]. Each time you offer an army member, draw a card.
- Eternal Pyre `pyre` — 2 mana, Item [Uncommon]. Each time you offer an army member, deal 2 damage to the opponent.
- Ossuary of Heroes `ossuary` — 2 mana, Modifier [Uncommon]. Your Offering army members get +1/+1.
- Hermes' Messenger `herm` — 2 mana, Army 1/2 💀1 [Common]. Flying, Offering. When it enters, draw a card.
- Eagle of Zeus `eagle` — 4 mana, Army 3/2 💀3 [Uncommon]. Flying, Offering. When it enters, draw a card. When offered, gain 2 extra mana.
- Minotaur of Crete `mino` — 4 mana, Army 4/3 💀3 [Uncommon]. Offering. When it dies or is offered, deal 3 damage to the opponent.
- Cerberus `cerb` — 5 mana, Army 4/5 💀4 [Rare]. Offering. When it dies or is offered, deal 2 damage to each opposing army member.
- Bull of Poseidon `tbull` — 3 mana, Army 3/3 💀2 [Common]. Offering. When it dies or is offered, draw a card.
- Charon the Ferryman `charon` — 3 mana, Army 3/4 💀3 [Uncommon]. Offering. When offered, gain 2 extra mana and draw a card.
- Delphic Augur `augur` — 2 mana, Army 1/3 💀2 [Common]. Offering. When it dies or is offered, gain 3 life.
- Sphinx of Thebes `sphinx` — 3 mana, Army 2/4 💀3 [Uncommon]. Offering. When it dies or is offered, return a random other army member from your graveyard to your hand.
- Iphigenia `iph` — 3 mana, Army 2/4 💀4 [Legendary]. Offering. When offered, gain 3 extra mana and draw 2 cards.
- Hades, Lord of the Dead `hades` — 4 mana, Army 4/6 💀4 [Legendary]. Offering. Each time you offer another army member, deal 3 damage to the opponent. You may draw a card; if you do, discard a card.
- Thanatos `thanat` — 3 mana, Army 3/3 💀3 [Rare]. Offering. When it dies or is offered, deal 5 damage to a random opponent army member.

Generic (21):
- Phalanx Drill `drill` — 3 mana, Spell [Common]. Your Phalanx army members get +1/+1 permanently.
- Testudo `testudo` — 2 mana, Quick spell [Uncommon]. Your army members in defense form get +2/+2 until end of turn.
- Fury of Ares `fury` — 1 mana, Quick spell [Common]. Target army member gets +3/+0 until end of turn.
- Rallying Cry `rally` — 2 mana, Quick spell [Common]. Your army members get +1/+1 until end of turn.
- Spoils of War `spoils` — 2 mana, Spell [Common]. Deal 1 damage to the opponent for each Raider you control. Draw a card.
- Hecatomb `hecat` — 2 mana, Spell [Common]. Offer one of your army members, then draw 2 cards.
- Requiem `requiem` — 5 mana, Spell [Rare]. Deal damage to the opponent equal to the cards in your graveyard (up to 8).
- Trojan Sapper `sapper` — 3 mana, Army 2/3 💀1 [Common]. When it enters, destroy target opponent's item or modifier.
- Asclepius' Salve `salve` — 1 mana, Quick spell [Common]. Restore 4 health to target army member.
- Wine-Dark Gale `gale` — 2 mana, Quick spell [Uncommon]. Return target army member to its owner's hand.
- Hephaestus' Hammer `hammer` — 2 mana, Quick spell [Common]. Destroy target opponent's item or modifier.
- Temple Plunder `plunder` — 3 mana, Spell [Uncommon]. Destroy target opponent's item or modifier. Draw a card.
- Thunderbolt of Zeus `thunder` — 3 mana, Spell [Rare]. Deal 4 damage to target army member (6 if it has flying).
- Bow of Odysseus `bow` — 3 mana, Item [Rare]. Tap: 1 damage to any target.
- Pegasus `pegasus` — 3 mana, Army 2/3 💀2 [Uncommon]. Flying
- Bastion of Sparta `bastion` — 4 mana, Spell [Uncommon]. Your Phalanx army members get +1/+3 permanently.
- Sack of Ismarus `sack` — 4 mana, Spell [Uncommon]. Deal 2 damage to the opponent for each Raider you control.
- Muse's Inspiration `muse` — 3 mana, Spell [Uncommon]. Draw 2 cards.
- Divine Karma `karma` — 3 mana, Modifier [Legendary]. Leftover mana carries over to your next turn.
- Charge of the Amazons `horde` — 2 mana, Quick spell [Legendary]. Your Raiders get +4/+0 until end of turn.
- Funeral Games `games` — 2 mana, Spell [Rare]. Offer one of your army members. Your army members get +1/+1 permanently and you draw a card.

### 5.2 Odin (`odin`) — Norse, home realm "the Nine Worlds"

In-game blurb: "Life is a resource. Pay life for 1 mana (once per turn; costs 2, 3, 4... as the fight goes on) and grow stronger when you are Wounded. Berserkers hit hardest when hurt, Valhalla turns the fallen into a mighty host, and Runes carve permanent power at a cost in blood. A few cards heal, but never enough to be safe."

**Core economy:** Blood Price, Wounded, Carve (section 2). Hard rule: Odin's healing must never rival the life he loses, so players don't lean on campfires. Several heals only work "while you are Wounded", and some are capped by `hcap` so they can't lift you above half your max life.

**Archetypes:**
- **Berserkers** (`B`): Bloodlust and Battle-rage. They get stronger when they are damaged or when you are Wounded. Self-damage enablers (Spear-Marked Thrall, Spear-Gash, Blood Rite).
- **Valhalla** (`V`): death triggers, Fallen counting, Einherjar tokens, and recursion (The Fallen Jarl, Feast of Heroes, Baldr).
- **Runes** (`H`): cheap Carve modifiers and items that give permanent value (Uruz, Algiz, Fehu, Ansuz, Tiwaz), card draw, flyers and the ravens.

Pool size: 74 = 22 Common, 27 Uncommon, 18 Rare, 7 Legendary. By archetype: Berserkers 21, Valhalla 21, Runes 21, Generic 11. Divine Karma is in Odin's pool too.

STAPLES (always in the starting deck):
- Hirdman `hird` — 1 mana, Army 2/1 💀1 [Common]
- Thrall `thrl` — 1 mana, Army 1/3 💀1 [Common]
- Gungnir's Throw `gung` — 2 mana, Quick spell [Uncommon]. Deal 3 damage to target army member.
- Blood Oath `oath` — 1 mana, Quick spell [Common]. Carve 2. Target army member gets +3/+3 until end of turn.

DRAFT POOL (74 cards):

Berserkers (21):
- Ulfhednar Initiate `ulf` — 1 mana, Army 1/2 💀1 [Common]. Bloodlust
- Bear-Shirt Berserker `bsrk` — 2 mana, Army 2/2 💀1 [Common]. Battle-rage
- Fjord Raider `fjrd` — 2 mana, Army 3/1 💀1 [Common]. Charge
- Skar the Scarred `skar` — 2 mana, Army 2/2 💀1 [Uncommon]. Bloodlust
- Wolf-Coat Warrior `wulf` — 3 mana, Army 3/2 💀2 [Common]. Battle-rage
- Giant-Slayer `gslay` — 3 mana, Army 3/3 💀2 [Common]. Bloodlust
- Egil the Mad `egil` — 3 mana, Army 3/3 💀2 [Uncommon]. Battle-rage, Bloodlust
- Blood-Drinker `blod` — 3 mana, Army 4/4 💀2 [Rare]. When it enters, deal 3 damage to you.
- Skull-Cleaver `skul` — 4 mana, Army 5/5 💀2 [Uncommon]. Battle-rage
- Ulf, the Berserk King `ulfk` — 4 mana, Army 4/6 💀3 [Rare]. Battle-rage, Bloodlust
- Starkad the Oathbreaker `star` — 5 mana, Army 6/6 💀3 [Legendary]. Battle-rage, Charge
- Blood Rite `bldr` — 2 mana, Spell [Common]. Deal 2 damage to you. Draw 2 cards.
- War Howl `howl` — 1 mana, Quick spell [Common]. Target army member gets +2/+0 until end of turn (+3/+0 if you are Wounded).
- Berserkergang `rage` — 3 mana, Quick spell [Uncommon]. Your army members get +3/+0 until end of turn (+5/+0 if you are Wounded).
- Mead-Hall Fury `mhall` — 3 mana, Modifier [Uncommon]. Your army members with Bloodlust or Battle-rage get +1/+1.
- Skull-Splitter `rend` — 4 mana, Spell [Rare]. Deal 6 damage to target army member. Deal 2 damage to you.
- Roar of the Wolf-Coats `roar` — 3 mana, Quick spell [Rare]. Tap all opposing army members.
- Spear-Marked Thrall `sprm` — 1 mana, Army 1/2 💀1 [Common]. Bloodlust. When it enters, deal 1 damage to it.
- Spear-Gash `gash` — 1 mana, Quick spell [Uncommon]. Deal 2 damage to target army member you control. It gets +2/+2 until end of turn.
- Hamramr the Shape-Shifter `hamr` — 3 mana, Army 2/3 💀2 [Uncommon]. While you are Wounded, it gets +2/+2.
- Last Stand of the Doomed `lstd` — 2 mana, Quick spell [Rare]. Your army members get +2/+2 until end of turn (+3/+3 if you are Wounded).

Valhalla (21):
- Thegn of the Hall `thegn` — 1 mana, Army 1/2 💀1 [Common]. When it dies, draw a card.
- Shield-Maiden `shmd` — 2 mana, Army 1/3 💀1 [Common]. When it dies, gain 2 life.
- Einherjar Warrior `einw` — 2 mana, Army 2/2 💀1 [Common]. When it dies, deal 1 damage to each opposing army member.
- Skald of the Fallen `skld` — 2 mana, Army 1/2 💀1 [Uncommon]. Each time another army member of yours dies, it gets +1/+1 permanently.
- Valkyrie `valk` — 3 mana, Army 2/2 💀2 [Uncommon]. Flying. Gets +1/+1 for every 2 of your army members that have died this fight.
- Eir the Healer `eir` — 3 mana, Army 2/4 💀2 [Uncommon]. When it dies, gain 4 life.
- Housecarl `huscl` — 3 mana, Army 3/3 💀2 [Common]. When it dies, deal 3 damage to the opponent.
- The Fallen Jarl `jarl` — 3 mana, Army 3/5 💀3 [Rare]. When it dies, return another random army member from your graveyard to your hand.
- Brynhild, the Shield-Maiden `brynh` — 4 mana, Army 3/4 💀3 [Legendary]. Flying, Draining
- Sigurd the Dragon-Slayer `sigur` — 4 mana, Army 4/5 💀3 [Rare]. Resilient
- Hall of the Slain `ghall` — 2 mana, Modifier [Uncommon]. Each time one of your army members dies, deal 1 damage to the opponent and gain 1 life (only while you are Wounded).
- Feast of Heroes `vfea` — 4 mana, Spell [Rare]. Return the most expensive army member in your graveyard to your army. It gets +1/+1 permanently.
- Host of Valhalla `host` — 4 mana, Spell [Rare]. Create a 3/3 Einherjar for every 2 of your army members that have died this fight (at least 1, up to 3).
- Pyre of Heroes `ofr` — 1 mana, Spell [Common]. Offer one of your army members. Gain 3 life and draw 2 cards.
- Marshal the Dead `vmar` — 2 mana, Quick spell [Uncommon]. Your army members get +1/+1 until end of turn for each of your army members that has died (up to +3).
- Hall-Guard of Valhalla `hguard` — 3 mana, Army 2/3 💀2 [Uncommon]. When it dies, create a 3/3 Einherjar.
- Battlefield Scavenger `scav` — 2 mana, Army 2/2 💀1 [Uncommon]. Each time another army member of yours dies, deal 1 damage to the opponent.
- Standard-Bearer `stdb` — 2 mana, Army 1/2 💀1 [Common]. When it dies, your other army members get +1/+1 permanently.
- Slain-Strike `slst` — 2 mana, Spell [Uncommon]. Deal damage to target army member equal to the number of your army members that have died this fight (at least 2, up to 6).
- Gunnar, Hall-Warden `gunn` — 4 mana, Army 3/4 💀2 [Rare]. When it enters, create a 3/3 Einherjar.
- Baldr the Beautiful `bald` — 4 mana, Army 4/5 💀3 [Legendary]. When it dies, return up to 2 random army members from your graveyard to your army.

Runes (21):
- Huginn, Raven of Thought `hugi` — 2 mana, Army 1/2 💀1 [Common]. Flying. When it enters, draw a card.
- Muninn, Raven of Memory `muni` — 2 mana, Army 1/2 💀1 [Common]. Flying. When it dies, draw a card.
- Skaldic Bard `skal` — 2 mana, Army 1/3 💀1 [Common]. When it enters, gain 3 life.
- Rune-Carver `rser` — 2 mana, Army 1/3 💀1 [Uncommon]. Your Carve costs are reduced by 1.
- Fylgja, Guardian Spirit `fylg` — 3 mana, Army 2/5 💀2 [Uncommon]. Flying, Ward
- Hrafnagud, the Raven-God `hrav` — 4 mana, Army 3/4 💀3 [Rare]. Flying. When it enters, draw a card.
- Uruz, Rune of Strength `ruru` — 1 mana, Modifier [Uncommon]. Carve 3. Your army members get +1/+0.
- Algiz, Rune of Protection `alg` — 1 mana, Modifier [Uncommon]. Carve 2. Your army members get +0/+2.
- Fehu, Rune of Wealth `fehu` — 1 mana, Modifier [Rare]. Carve 3. At the start of your turn, gain 1 mana.
- Rune of Eir `reir` — 1 mana, Item [Common]. Carve 2. Tap: gain 1 life (only while you are Wounded).
- Mimir's Well `mimr` — 1 mana, Modifier [Rare]. At the start of your turn, draw a card. Deal 1 damage to you unless you are Wounded.
- Raven Banner `rfly` — 4 mana, Item [Uncommon]. Your flying army members get +1/+1.
- Galdr of Winds `gald` — 1 mana, Quick spell [Common]. Carve 1. Return target army member to its owner's hand.
- Seidr Hex `seid` — 2 mana, Spell [Uncommon]. Carve 1. Target army member gets -3/-3 permanently.
- Yggdrasil, the World-Tree `ygg` — 4 mana, Modifier [Legendary]. Carve 2. Your army members get +1/+2. At the start of your turn, gain 1 life (only while you are Wounded).
- The Norns `norn` — 5 mana, Spell [Rare]. Draw 3 cards. Gain 4 life.
- Tiwaz, Rune of Victory `tiwa` — 2 mana, Item [Uncommon]. Carve 1. Tap: deal 1 damage to target opposing army member.
- Rune-Scribe `scrb` — 2 mana, Army 1/3 💀1 [Common]. When it enters, draw a card for each Rune you control (up to 2).
- Ansuz, Rune of Speech `ansu` — 1 mana, Modifier [Uncommon]. Carve 1. At the start of your turn, if you have 2 or fewer cards in hand, draw a card.
- The Volva `volv` — 3 mana, Army 1/4 💀2 [Uncommon]. When it enters, draw 2 cards and deal 2 damage to you.
- Hagalaz, Rune of Hail `hagl` — 3 mana, Spell [Rare]. Carve 1. Deal 2 damage to each opposing army member.

Generic (11):
- Sleipnir `slei` — 4 mana, Army 4/3 💀3 [Rare]. Flying, Charge
- Mjolnir `mjol` — 4 mana, Item [Rare]. Tap: deal 2 damage to target opposing army member.
- Thor, the Thunderer `thor` — 5 mana, Army 6/5 💀3 [Legendary]. When it enters, deal 3 damage to target opposing army member.
- Loki's Snare `loki` — 2 mana, Quick spell [Uncommon]. Tap target army member; it doesn't untap next turn.
- Tyr, the One-Handed `tyr` — 3 mana, Army 3/4 💀2 [Rare]. Ward
- Idunn's Apples `idun` — 3 mana, Item [Uncommon]. At the start of your turn, restore 1 health to each of your army members.
- Hel's Embrace `hela` — 3 mana, Spell [Uncommon]. Destroy target army member that has damage on it.
- Volund the Smith `vlnd` — 3 mana, Army 2/4 💀1 [Common]. When it enters, destroy target opposing item or modifier.
- Divine Karma `karma` — 3 mana, Modifier [Legendary]. Leftover mana carries over to your next turn.
- Odin, the Allfather `odn` — 5 mana, Army 3/5 💀3 [Legendary]. Flying. When it enters, draw 2 cards and deal 2 damage to you.
- Mead of Poetry `mead` — 1 mana, Spell [Common]. Draw a card. If you are Wounded, draw 2 instead.

### 5.3 Sun Wukong (`wukong`) — Chinese (Journey to the West), home realm "the Western Heaven"

In-game blurb: "Chain cards of different types (Strike, Trick, Leap) to build Momentum, and the more cards you play in a turn, the harder your payoffs hit. Spare Hairs and Peaches shuffle into your deck to keep the chain alive, and Disintegrated cards vanish for good. A swarm of small monkeys and a hand full of spells."

**Design intent:** the fast, nimble character, paced like the Silent in Slay the Spire. He chains cheap cards, and he also cares about the order he plays them in (types that differ build Momentum). A 15-card deck is too small for draw to matter, so cards shuffle tokens into his deck mid-fight (Spare Hair, Peach) instead of enlarging the starting draft. Wukong is the only hero whose draft is allowed to offer three non-army cards at once.

Card decisions Ben made:
- Peaches of Immortality costs 2 (upgrades can lower it).
- Seventy-Two Changes and Cloud Somersault (the reshuffle, a must-have) are approved.
- Cards that tamper with the opponent's deck appear only at rare and above, and carefully, because enemy draw isn't factored into balance.
- Slowing the opponent's draw was rejected as too strong.
- He prefers turning a creature into a copy of the opponent's creature or the opponent's top card over straight self-copying.
- Hair works as spell-like unblockable chip damage.

**Archetypes:**
- **Clones** (`C`): Spare Hair, Peach and Clone token generation, plus "cards played this turn" payoffs.
- **Staff** (`W`): Strike payoffs that scale with Momentum (Ruyi Jingu Bang, Staff Spin, Heaven-Splitting Blow).
- **Trickster** (`T`): Trick and Leap tempo: tapping, bouncing, copying and stealing (Transformation, Heavenly Heist, Six-Eared Macaque), and Disintegrate synergies.

Pool size: 80 = 20 Common, 20 Uncommon, 20 Rare, 20 Legendary (complete). By archetype: Trickster 36, Staff 25, Clones 18, Generic 1.

### 5.4 Planned heroes

- **Egypt** is confirmed as the 4th hero but parked. Themes: duality, and briefly suspending death. The specific character is undecided; Thoth was the leading idea.
- Ben's plan is 4 characters total.
STAPLES (always in the starting deck):
- Mountain Monkey `wmonk` — 1 mana, Army 1/2 💀1 [Common]. When it enters, draw a card.
- Hair Dart `wdart` — 0 mana, Quick spell [Common]. Deal 1 damage to target opposing army member or the opponent.
- Iron Rod `wrod` — 1 mana, Spell [Common]. Deal 2 damage to target opposing army member or the opponent.
- Cloud Somersault `wsomer` — 2 mana, Spell [Common, arch T]. Shuffle your graveyard into your deck, then draw a card. Disintegrate.

DRAFT POOL (80 cards):

Clones (18):
- Hair-Born Troop `wtroop` — 2 mana, Army 1/2 💀1 [Uncommon]. When it enters, shuffle a Spare Hair into your deck.
- Orchard Raid `worchard` — 1 mana, Spell [Uncommon]. Shuffle a Peach into your deck for every 2 cards you have played this turn (at least 1).
- Peach-Pit Augury `waugury` — 0 mana, Spell [Common]. Draw a card. Draw another if the top card of your library is a Spare Hair or a Peach.
- Pluck a Hair `wpluck` — 1 mana, Spell [Common]. Shuffle 2 Spare Hairs into your deck. Draw a card.
- Hair Volley `wvolley` — 1 mana, Spell [Common]. Deal damage to target opposing army member equal to half the cards you have played this turn (rounded down, at least 1).
- Hair Storm `whstorm` — 2 mana, Spell [Uncommon]. Deal 1 damage to each opposing army member (2 damage if your Momentum is 3 or more).
- Clone of the Great Sage `wclone` — 1 mana, Army 1/1 💀1 [Common]. Charge. When it dies, shuffle a Spare Hair into your deck.
- A Thousand Hairs `wthou` — 2 mana, Spell [Legendary]. Shuffle 4 Spare Hairs into your deck. Draw 2 cards.
- Hair Whirl `wcloudh` — 1 mana, Spell [Uncommon]. Draw a card for every 2 cards you have played this turn (at least 1).
- Mirror Hair `wmirror` — 1 mana, Spell [Rare]. The next spell you cast this turn is cast twice.
- Acrobat Monkey `wacro` — 2 mana, Army 1/2 💀1 [Uncommon]. Gets +1/+0 until end of turn each time your Momentum rises.
- Feint `wfeint` — 0 mana, Spell [Common]. Draw a card. If the card you played just before this one was a Strike, draw another card.
- Heavenly Wine `wwine` — 0 mana, Spell [Common]. Draw a card. Disintegrate.
- Hair-Born Legion `wlegion` — 3 mana, Army 2/3 💀2 [Uncommon]. When it enters, shuffle 2 Spare Hairs into your deck.
- Mirror Monkey `wmirm` — 2 mana, Army 1/3 💀1 [Uncommon]. When it dies, draw a card and shuffle a Spare Hair into your deck.
- Disciple of the Sage `wdisc` — 3 mana, Army 2/4 💀2 [Rare]. Gets +2/+0 until end of turn when you play your 3rd card in a turn.
- Nothingness Monk `wnull` — 2 mana, Army 1/3 💀1 [Uncommon]. Whenever one of your cards Disintegrates, it gets +1/+1 until end of turn.
- Great Wall Monkey `wgreat` — 4 mana, Army 2/6 💀3 [Rare]. Resilient. When it enters, gain 3 life.

Staff (25):
- Three Forms `wtypes` — 1 mana, Spell [Rare]. Deal damage to target opposing army member equal to the number of different types (Strike, Trick, Leap) you have played this turn.
- Myriad Staffs `wmyriad` — 2 mana, Spell [Legendary]. Deal damage to the opponent and to each opposing army member equal to half your Momentum (rounded up, at least 1).
- Staff Spin `wspin` — 2 mana, Spell [Common]. Deal damage to target opposing army member equal to your Momentum plus 1.
- Grow Tall `wgrow` — 1 mana, Spell [Common]. Target army member you control gets +X/+0 until end of turn, where X is your Momentum (at least 1).
- Ruyi Jingu Bang `wruyi` — 2 mana, Modifier [Legendary]. Whenever you play your 3rd, 6th or 9th card in a turn, the Staff strikes the opponent for damage equal to your Momentum.
- Heaven-Splitting Blow `wsplit` — 2 mana, Spell [Legendary]. Deal damage to the opponent equal to your Momentum plus half the cards you have played this turn (rounded down).
- Staff Smash `wsmash` — 2 mana, Spell [Rare]. Deal 2 damage to target opposing army member and 1 damage to each other opposing army member.
- Sun Wukong, the Great Sage `wking` — 3 mana, Army 3/4 💀3 [Legendary]. Charge. Gets +1/+1 until end of turn each time your Momentum rises.
- Somersault Strike `wcloudr` — 1 mana, Spell [Uncommon]. Target army member you control gets +1/+0 and cannot be blocked this turn.
- Monkey Sentry `wsent` — 2 mana, Army 1/4 💀1 [Common]. Can only defend
- Fire-Eyed Gaze `wpierce` — 2 mana, Spell [Common]. Deal 3 damage to target opposing army member.
- Flurry of Blows `wflurry` — 1 mana, Spell [Rare]. Deal damage to the opponent equal to half the cards you have played this turn (rounded down, at least 1).
- Rout the Heavenly Host `wrout` — 2 mana, Spell [Rare]. Deal 1 damage to each opposing army member, plus 1 more for every 3 cards you have played this turn.
- Whirling Staff `wblock` — 1 mana, Quick spell [Common]. Target army member you control gets +X/+X until end of turn, where X is your Momentum (at least 1).
- Counter-Strike `wcounter` — 0 mana, Spell [Common]. Deal 1 damage to target opposing army member (3 damage if the card you played just before this one was a Leap).
- Quick Dodge `wdodge` — 0 mana, Quick spell [Common]. Target army member you control gets +0/+3 until end of turn.
- Zhu Bajie, the Pig `wpig` — 2 mana, Army 3/3 💀2 [Rare]
- Staff-Bearer `wbear` — 2 mana, Army 2/2 💀1 [Uncommon]. When it enters, the opponent takes damage equal to your Momentum (at most 3).
- Heaven-Breaker `wbreak` — 4 mana, Army 3/4 💀3 [Rare]. When it enters, deal 1 damage to each opposing army member (2 if your Momentum is 2 or more).
- Whirlwind Vanguard `wvang` — 2 mana, Army 2/1 💀1 [Uncommon]. Charge. Gets +1/+0 until end of turn each time your Momentum rises.
- Burn the Ledger `wburn` — 1 mana, Spell [Rare]. Disintegrate the top card of your library. Deal damage to the opponent equal to its cost plus 1.
- Jade Gate Guard `wgate` — 3 mana, Army 1/5 💀2 [Common]. Phalanx
- Rally the Troops `wrally` — 2 mana, Spell [Uncommon]. Each army member you control gets +1/+1 until end of turn (+2/+2 if you control 4 or more).
- Equal to Heaven `wqt` — 5 mana, Army 4/6 💀3 [Legendary]. Charge. Whenever you play a card, it gets +1/+0 until end of turn.
- Staff of Ten Thousand Jin `wbigstaff` — 5 mana, Spell [Legendary]. Deal damage to the opponent equal to 4 plus your Momentum, and 3 damage to each opposing army member.

Trickster (36):
- Nimble Footwork `wfoot` — 0 mana, Spell [Common]. If you have played 3 or more cards this turn (including this one), gain 1 mana.
- Windborne Monkey `wwind` — 1 mana, Army 1/1 💀1 [Uncommon]. Flying. When it enters, if your Momentum is 2 or more, draw a card.
- Five-Finger Seal `wseal` — 2 mana, Spell [Uncommon]. Tap target opposing army member. It does not untap during their next untap step.
- Afterimage `wecho` — 1 mana, Spell [Rare]. Cast the effect of the card you played just before this one again, if it was an untargeted spell costing 1 or less.
- Tang Sanzang, the Pilgrim `wtang` — 2 mana, Army 1/3 💀1 [Legendary]. Whenever you play the 3rd card of a turn, draw a card.
- Shrink to a Needle `wpocket` — 1 mana, Spell [Uncommon]. Return target army member you control to your hand. It costs 1 less to play this time.
- Seventy-Two Changes `wchange` — 2 mana, Spell [Rare]. Shuffle 2 copies of the card you played just before this one into your deck. The copies Disintegrate when played.
- Transformation `wxform` — 2 mana, Spell [Legendary]. Target army member you control becomes a copy of the opposing army member that costs the most.
- Heavenly Heist `wheist` — 2 mana, Spell [Legendary]. Put a copy of the top card of the opponent's library into your hand. It costs 1 less and Disintegrates.
- Peaches of Immortality `wpeachc` — 2 mana, Spell [Uncommon]. Shuffle 3 Peaches into your deck.
- Eight-Trigram Furnace `wfurn` — 1 mana, Spell [Rare]. Shuffle target army member you control into your deck. It gets +1/+1 for the rest of the fight.
- Erased from the Ledger `wledger` — 1 mana, Spell [Rare]. Target army member you control: when it dies or is offered this fight, it is shuffled into your deck instead. Draw a card.
- Five Elements Mountain `wmount` — 2 mana, Spell [Legendary]. Shuffle 3 Weights of the Mountain into the opponent's library. They are useless cards.
- Six-Eared Macaque `wsix` — 2 mana, Army 1/1 💀1 [Legendary]. When it enters, it becomes a copy of the opposing army member that costs the most among those costing 4 or less.
- Stolen Elixir `wdrink` — 1 mana, Spell [Common]. Gain 3 life. Draw a card (2 cards if your Momentum is 3 or more).
- Dancing Away `wdance` — 1 mana, Quick spell [Common]. Tap target opposing army member.
- Banana-Leaf Fan `wfan` — 2 mana, Spell [Legendary]. Return all opposing army members to their owner's hand.
- Slip Away `wslip` — 0 mana, Spell [Common]. Draw a card. If the card you played just before this one was a Trick, gain 1 mana.
- Full Circle `wcycle` — 0 mana, Spell [Legendary]. If you have played a Strike, a Trick and a Leap this turn (including this card), deal 4 damage to the opponent.
- Juggler Monkey `wjug` — 2 mana, Army 2/2 💀1 [Rare]. Whenever your Momentum rises, it deals 1 damage to the opponent.
- Peach Keeper `wpeachk` — 2 mana, Army 1/3 💀1 [Uncommon]. When it enters, shuffle a Heavenly Peach into your deck.
- Cloud Rider `wcloudm` — 3 mana, Army 2/3 💀2 [Rare]. Flying. When it dies, draw a card.
- Drum-Beater Monkey `wdrum` — 2 mana, Army 1/2 💀1 [Uncommon]. When it enters, your Momentum rises by 1.
- Funeral Pyre `wpyre` — 1 mana, Modifier [Legendary]. Whenever one of your cards Disintegrates, deal 2 damage to the opponent.
- Immortal Peach Tree `wtree` — 2 mana, Modifier [Legendary]. At the start of your turn, gain 2 life and shuffle a Heavenly Peach into your deck.
- Unravel Existence `wunravel` — 2 mana, Spell [Rare]. Deal damage to target opposing army member equal to the number of your cards that have Disintegrated this fight (at least 2).
- Shed a Skin `wskin` — 0 mana, Spell [Rare]. Counts as any type. Shuffle a Spare Hair into your deck. Draw a card.
- Chameleon Monkey `wchamel` — 1 mana, Army 1/2 💀1 [Common]. Counts as any type.
- Peach Banquet `wbanq` — 2 mana, Spell [Rare]. Gain 2 life for each card you have played this turn (including this one).
- Mist Veil `wmist` — 2 mana, Quick spell [Uncommon]. Tap all opposing army members.
- Iron Fan Gust `wgust` — 2 mana, Quick spell [Uncommon]. Return target opposing army member to its owner's hand.
- Reveal the True Form `wunward` — 1 mana, Spell [Rare]. Opposing army members lose Ward for the rest of the fight.
- Million Monkeys `wmillion` — 5 mana, Spell [Legendary]. Put Clones of the Great Sage into play until your army is full (at most 3).
- Nezha, the Lotus Prince `wnez` — 4 mana, Army 4/3 💀3 [Legendary]. Flying. When it dies, return it to your hand.
- Sha Wujing, the Sand Monk `wsandy` — 3 mana, Army 2/5 💀2 [Legendary]. Phalanx. Whenever your Momentum rises, gain 1 life.
- Queen Mother's Banquet `wpeachg` — 4 mana, Spell [Legendary]. Gain 6 life. Shuffle 3 Peaches into your deck. Draw 2 cards.

Generic (1):
- Cloud Step `wstep` — 0 mana, Quick spell [Common]. Return target army member you control to your hand.

---

## 6. Enemies

**How enemies work:**
- Every enemy plays a real deck with automatic mana.
- Base mana is 2, plus offerings. Hrungnir gets 3 (`mp:3`). The Shades also get extra mana from their trump.
- Each regular enemy is built on one archetype and has a distinct, optimally played plan. Every enemy should feel unlike every other enemy.

**Tiered trump system:**
- Regular fights have a **mini-trump**: a 0-cost Warded modifier that starts in hand and is played turn 1.
- Elites have a bigger trump.
- Bosses have a game-flow trump that is already in play.
- Trump cards have Ward, so they cannot be removed.

**Scaling** (stats only; enemy cards never change). `scaleEnemy(e,[life,+power,+health])` changes enemy life and the stats of every army member in its deck:
- Fight index 0–3 (`SCL`): [-3,0,0], [+4,+1,0], [+7,+1,+2], [+9,+3,+2].
- Per-hero corrections on top for regular fights (`CFA`):
  - ody: {1:[-4,-1,0], 2:[-9,-1,-1], 3:[-9,-3,-1]}
  - odin: {0:[-1,0,0], 1:[-10,-1,0], 2:[-9,-1,-2], 3:[-9,-3,-2]}
  - wukong: {0:[-1,0,0] (added in v97), 1:[-6,-1,0], 2:[-9,-1,-2], 3:[-10,-3,-1]}
- Elites use `CFAE` instead of `CFA`:
  - ody: {2:[-3,0,0]}
  - odin: {1:[-5,-1,0], 2:[-6,-1,-1], 3:[-6,-1,-1]}
  - wukong: {1:[-2,0,0], 2:[-5,-1,0], 3:[-6,-1,0]}
- So fight-1 regular enemies have 12 life (Odysseus) or 11 life (Odin, Wukong).
- Act 2 uses `SCL[4..7]` = [0,0,0], [+3,0,0], [+6,0,0], [+8,+1,0], plus a cross-realm adjustment (`XADJ`): 'ody:odin' [0,-1,0], 'odin:ody' [+5,+1,0], 'odin:wukong' [+6,0,0], 'ody:wukong' [-2,0,0], 'wukong:odin' [-3,0,0], 'wukong:ody' [+4,0,0]. `CFA` is not applied in Act 2.
- Bosses use their own `sc` array. In Act 2 they also get +[4,1,0].
- Enemy damage spells grow with fight index: `xb()` adds 0/+1/+1/+3 by fight index, or +2 (`BOSSX`) for bosses. Example: Doom Decree, Boulder Hurl and Nightshade deal 4/5/5/7 at fights 1–4.
- Card text is live (the `DYN` registry), so cards show the real number. This fixed a v97 bug report: "4 damage killed my 5-health guy" was real scaling behind misleading text.
- Elites and bosses don't use the 15-life base.

Rules for designing bosses:
- Flavor text is exactly **5 sentences**. It builds suspense and subtly hints at the boss's strategy and its weakness, so a careful reader can work it out before the fight.
- No swarm bosses: they scale badly. No more giants.
- Every boss must feel mechanically unlike every other boss, e.g. no more Hector-like walls.
- No puzzles that require a specific item: Ben rejected the Baldr puzzle because that item becomes dead weight afterwards.
- Saved for later: "the Claimed" (dead army members ride for the boss) and Fimbulwinter (a winter clock).
- Charybdis's and Scylla's swarm feel predates the no-swarm rule.

Rejected or cut enemy ideas: Achilles as a boss (not canon, and a Charge raider fight already exists). Polyphemus and the Sirens are regular fights, not bosses.

Fight-1 balance changes from earlier redesigns:
- The Shades of Hades were made less swarmy and more mechanic-based.
- The Cicones were made more distinct ("Hit and Run").
- The Lotus-Eaters (tapping) and Loki's Court (bouncing) were judged different enough to keep both.

### 6.1 Odysseus realm (the strait)

Regular enemies:

**The Lotus-Eaters** 🪷 — base life 15, 17-card deck. Hint: "Taps and freezes your army".
  Mini-trump (starts in hand, played turn 1): Lotus Haze — Ward. The first army member you play each turn enters tapped.
  - 2x Drowsy Islander `isl` — 1 mana, Army 2/3 💀1. Opportunist
  - 2x Lotus-Eater `lot` — 2 mana, Army 3/4 💀2. Ruthless, Opportunist
  - Poppy Priest `priest` — 2 mana, Army 1/4 💀2. Opportunist. When it enters, tap target opponent's army member.
  - 2x Slumber Reaper `reaper` — 3 mana, Army 3/4 💀2. Siege, Opportunist
  - Drowsy Titan `titan` — 4 mana, Army 3/6 💀3. Ruthless, Opportunist. Skips its next untap after attacking.
  - Hypnotic Sip `sip` — 2 mana, Quick spell. Tap target opponent's army member; it doesn't untap next turn.
  - Dreamless Sleep `dream` — 5 mana, Spell. Tap all of your opponent's army members. They don't untap next turn.
  - Poppy Censer `censer` — 2 mana, Item. At the start of your turn, tap your opponent's strongest untapped army member.
  - Lotus Garden `garden` — 2 mana, Modifier. Your Drowsy army members get +1/+1.
  - Narcotic Fog `fog` — 3 mana, Spell. Tap all of your opponent's untapped army members.
  - Island Breeze `breeze` — 2 mana, Quick spell. Gain 3 life.
  - 2x Poppy Dart-Thrower `lbow` — 2 mana, Army 1/4 💀1. Range
  - Nightshade Draught `nshade` — 3 mana, Spell. Deal 4 damage to target army member. Grows stronger the further you travel.

**The Sirens** 🧜 — base life 15, 17-card deck. Hint: "Flyers and the Sirens' song".
  Mini-trump (starts in hand, played turn 1): Song of the Sirens — Opponent's army members can't switch to defense form.
  - 3x Siren Scout `scout` — 1 mana, Army 1/2 💀1. Flying
  - 3x Song-Caller `song` — 2 mana, Army 3/2 💀1. Flying
  - 3x Siren of Anthemoessa `siren` — 3 mana, Army 4/3 💀2. Flying
  - Moray Eel `eel` — 2 mana, Army 2/3 💀1. Venomous, Can only defend
  - Lyre of the Deep `lyre` — 3 mana, Item. Your flying army members have Draining.
  - Chorus of the Deep `skies` — 2 mana, Modifier. Your flying army members get +1 power.
  - Jagged Shoal `shoal` — 2 mana, Modifier. Non-flying attackers deal 1 damage to their controller.
  - 2x Enthralling Melody `melody` — 2 mana, Spell. Target opponent's army member switches to attack form and must attack next turn.
  - Lure of the Deep `lure` — 3 mana, Spell. Target opponent's army member gets -2/-2.
  - Dirge of the Deep `dirge` — 5 mana, Spell. Deal damage to the opponent equal to the total power of your flying army members.

**Polyphemus** 👁️ — base life 15, 15-card deck. Hint: "Giant Cyclops and boulders".
  Mini-trump (starts in hand, played turn 1): Cave Mouth — Opponent's army members with power 1 or less can't attack.
  - 4x Flock Sheep `sheep` — 1 mana, Army 1/3 💀2. When it dies, its controller gains 2 life.
  - 2x Cyclops Scout `cscout` — 2 mana, Army 4/3 💀1. Ruthless, Cyclops
  - Cave Dweller `cave` — 3 mana, Army 3/5 💀2. Phalanx, Cyclops
  - 2x Cyclops Brute `brute` — 3 mana, Army 4/5 💀3. Ruthless, Cyclops
  - Cyclops Elder `elder` — 4 mana, Army 5/6 💀3. Resilient, Cyclops
  - 2x Polyphemus `poly` — 4 mana, Army 6/9 💀3. Ruthless, Bulldoze, Cyclops. Attacks each turn if able.
  - 2x Boulder Hurl `hurl` — 3 mana, Spell. Deal 4 damage to target army member.
  - Great Olive Club `club` — 3 mana, Item. Your army members with power 3 or more have Bulldoze.

**The Shades of Hades** 💀 — base life 15, 8-card deck. Hint: "Returning dead and graveyard power".
  Mini-trump (starts in hand, played turn 1): The Hungry Dead — Ward. Whenever an army member dies, the Shades gain 1 extra mana on their next turn (up to 2).
  - 2x Restless Shade `shade1` — 1 mana, Army 1/2 💀1. Shade. Restless: the first time it dies, it returns to its owner's hand.
  - 3x Mourning Shade `mourner` — 2 mana, Army 3/2 💀1. Shade. When it dies, draw a card.
  - Erebus Warden `warden` — 3 mana, Army 3/4 💀2. Shade, Resilient, Range
  - Libation of Blood `libation` — 4 mana, Spell. Return the two most recent army members from your graveyard to your army.
  - Pit of the Dead `pit` — 2 mana, Item. Whenever one of your army members dies, deal 1 damage to the opponent.

**The Phaeacians** ⛵ — base life 15, 14-card deck. Hint: "A warded, healing fleet".
  Mini-trump (starts in hand, played turn 1): The Black Ship — Your Fleet army members have Ward.
  - 2x Phaeacian Oarsman `oarsman` — 1 mana, Army 1/2 💀1. Fleet
  - 3x Phaeacian Navigator `navig` — 2 mana, Army 1/3 💀1. Fleet, Steadfast
  - 3x Scherian Guard `phguard` — 3 mana, Army 2/4 💀2. Fleet, Range
  - Nausicaa `nausi` — 2 mana, Army 1/3 💀1. Fleet. When it enters, gain 3 life.
  - King Alcinous `alcinous` — 5 mana, Army 3/5 💀3. Fleet, Steadfast. When it enters, restore all your army members to full health and gain 4 life.
  - Favoring Winds `sails` — 2 mana, Modifier. Your Fleet army members get +1 power.
  - Gift of Hospitality `gift` — 2 mana, Spell. Gain 4 life. Restore 2 health to each of your army members.
  - Mending Tide `tide` — 2 mana, Quick spell. Restore 3 health to target army member.
  - Poseidon's Trident `trident` — 3 mana, Spell. Deal 4 damage to target army member. Grows stronger the further you travel.

**The Cicones** 🪓 — base life 15, 12-card deck. Hint: "Charging marauders and fire".
  Mini-trump (starts in hand, played turn 1): Hit and Run — Ward. Marauders that deal combat damage to you return to their owner's hand and can be played again for free.
  - 2x Cicone Raider `mraid` — 1 mana, Army 2/2 💀1. Marauder, Charge
  - 2x Cicone Skirmisher `mskirm` — 2 mana, Army 3/3 💀1. Marauder, Charge
  - 2x Cicone Pillager `mpill` — 3 mana, Army 4/3 💀2. Marauder, Charge
  - Ismarus Chieftain `chief` — 4 mana, Army 4/5 💀2. Marauder, Charge, Rally
  - War Drums `drums` — 2 mana, Modifier. Your Marauders get +1 power.
  - 2x Burn the Granaries `burn` — 3 mana, Spell. Deal 2 damage to the opponent for each Marauder you control.
  - Javelin Volley `javel` — 2 mana, Spell. Deal 3 damage to target army member.
  - Cicone Slinger `cbow` — 2 mana, Army 2/3 💀1. Marauder, Range

Elites:

**Circe, Witch of Aeaea** 🐖 (ELITES[0]) — base life 17, 12 cards. Hint: "Her cup turns your strongest army member that costs 3 or more into a Swine. Offer the Swine, or let it die, and the original returns to your hand for 1 less mana".
  Trump: Circe's Cup — Ward. At the start of her turn, if you have no Swine, your strongest untapped army member that costs 3 or more (not a token) is turned into a Swine (1/1), and each Fawning Wolf and Mountain Lion she controls gets +1/+1 for the rest of the fight. When the Swine dies, is offered or leaves play, the original returns to your hand and costs 1 less to play.
  - 2x Fawning Wolf `cwolf` — 2 mana, Army 3/2 💀1. Ruthless
  - 2x Mountain Lion of Aeaea `clion` — 3 mana, Army 4/4 💀2. Ruthless
  - 3x Handmaid of Circe `cmaid` — 1 mana, Army 1/3 💀1. When it enters, restore 2 health to each of your army members.
  - Circe, Daughter of Helios `circe` — 4 mana, Army 3/5 💀3. Resilient. When it enters, tap the strongest opposing army member; it doesn't untap next turn.
  - 2x Circe's Wand `cwand` — 2 mana, Spell. Tap target army member; it doesn't untap next turn.
  - 2x Draught of Forgetting `cdraft` — 3 mana, Spell. Target army member gets -2/-2.

**Cattle of the Sun** 🐂 (ELITES[1]) — base life 18, 13 cards. Hint: "Killing the sacred herd brings Helios' wrath. Offer your own army members to atone; flyers pass over the cattle".
  Trump: The Sun God's Tally — Ward. Sacred cattle are the herd of Helios. Whenever one dies (not offered by their owner), a Sacrilege counter is added. At the start of their turn, Helios burns you for 1 per counter. Offering one of your army members removes a counter. Counters: 0
  - 4x Sacred Cow `cow` — 1 mana, Army 0/4 💀1. Can only defend. Sacred: when it dies, the Sun God's tally grows (unless its owner offers it).
  - 2x Bull of Helios `bull` — 3 mana, Army 1/7 💀2. Can only defend. Sacred: when it dies, the Sun God's tally grows (unless its owner offers it).
  - 2x Lampetia, the Shining `lamp` — 3 mana, Army 3/3 💀2. Flying
  - 2x Phaethusa, the Radiant `neith` — 2 mana, Army 3/3 💀1. Flying
  - Helios, the Sun `helios` — 4 mana, Army 5/5 💀3. Flying
  - 2x Sun-Scorch `scorch` — 3 mana, Spell. Deal 4 damage to target army member.

Bosses:

**Hector, Tamer of Horses** 🐴 (BOSS[0]) — life 22, scaling sc=[0,0,-1], 13 cards.
  Trump (on battlefield from the start): Walls of Troy — Ward. Attacking costs 1 mana per army member you attack with.
  Flavor: "Son of Priam and the last wall of Ilium, Hector never struck first; he stood before the gates among his spearmen and made every Greek pay a toll for each man he sent against them. For ten years the Achaeans learned that Troy cost more to attack with many hands than with few. Old Priam and the women of the city tended the wounded behind the line, so a slow siege only gave them time to mend. No storm ever took those walls; they fell to a single gift, wheeled in through the gate while the guards slept. They called him tamer of horses, and it was a horse that ended his city."
  - 3x Trojan Militia `hmil` — 1 mana, Army 1/3 💀1. Phalanx
  - 3x Trojan Spearman `hspr` — 2 mana, Army 2/4 💀1. Phalanx, Range
  - 2x Ilian Guard `hgua` — 3 mana, Army 3/5 💀2. Phalanx
  - Charioteer of Troy `hchar` — 2 mana, Army 3/2 💀2. Charge
  - Hector, Tamer of Horses `hector` — 4 mana, Army 5/6 💀3. Phalanx, Resilient. When it enters, your other Phalanx army members get +1/+1 permanently.
  - King Priam `priam` — 2 mana, Army 1/5 💀2. Phalanx. When it enters, gain 4 life.
  - Gift of Hospitality `gift` — 2 mana, Spell. Gain 4 life. Restore 2 health to each of your army members.
  - Mending Tide `tide` — 2 mana, Quick spell. Restore 3 health to target army member.

**Scylla** 🦑 (BOSS[1]) — life 23, scaling sc=[0,0,0], 13 cards.
  Trump (on battlefield from the start): The Six Heads — Ward. Each time Scylla's army members deal damage to you, you must offer your weakest army member.
  Flavor: "High in a cave above the strait waits Scylla, six long necks and six hungry heads, each with three rows of teeth crowded as a hound's. Circe warned Odysseus that no armor answers her and that to stand and fight is to lose the whole ship. Every blow that lands on a crew costs it a sailor, and the heads always seize the weakest man first. "Better to lose six than all," said the sorceress, and a crew with a few poor men to spare may yet sail on. Her heads are many but each one is small and easily cut, and only the ones that reach the deck do harm."
  - 3x Snapping Head `sh1` — 1 mana, Army 1/1 💀1. Ruthless
  - 3x Gnashing Head `sh2` — 2 mana, Army 2/1 💀1. Ruthless
  - 2x Baying Head `sh3` — 2 mana, Army 1/2 💀1. Draining, Range
  - 2x Venomous Head `sh4` — 3 mana, Army 3/2 💀1. Venomous
  - Scylla `scyl` — 5 mana, Army 5/6 💀3. Ruthless. When it enters, deal 2 damage to each opposing army member.
  - Withering Curse `curse` — 2 mana, Spell. Target army member gets -2/-2.
  - Javelin Volley `javel` — 2 mana, Spell. Deal 3 damage to target army member.

**Charybdis** 🌀 (BOSS[2]) — life 23, scaling sc=[0,0,0], 16 cards.
  Trump (on battlefield from the start): The Whirlpool — Ward. At the start of every third turn of yours, you lose 2 life and all army members on both sides return to their owners' hands.
  Flavor: "Beneath the great fig tree on the far rock, Charybdis drinks the sea three times each day and spews it back three times. Whatever the water holds, ship, oar and man alike, is dragged down and flung up again where it began. Odysseus clung to the fig tree and waited, for she gives back what she swallows, and only the patient recover what they lost. Not even Poseidon could pull a ship from her grasp once the third hour had come. So do not pour everything you own into one tide, and remember that she turns on a rhythm you can count."
  - 3x Drowned Sailor `cdro` — 1 mana, Army 1/2 💀1
  - 3x Whirlpool Spawn `cspa` — 2 mana, Army 2/3 💀1. Range. When it enters, tap target opposing army member.
  - 3x Maelstrom Eel `ceel` — 2 mana, Army 2/2 💀1. Flying. When it enters, draw a card.
  - 2x Leviathan of the Deep `clev` — 3 mana, Army 4/4 💀2. Resilient
  - Charybdis `chary` — 4 mana, Army 5/6 💀3. When it enters, tap all opposing army members.
  - 2x Undertow `undertow` — 2 mana, Spell. Tap target opponent's army member.
  - Honeyed Offering `honey` — 2 mana, Spell. Tap target opponent's army member; it doesn't untap next turn.
  - Mending Tide `tide` — 2 mana, Quick spell. Restore 3 health to target army member.

### 6.2 Odin realm (the Nine Worlds)

Regular enemies:

**Fenrir's Brood** 🐺 — base life 15, 8-card deck. Hint: "A pack that grows stronger together".
  Mini-trump (starts in hand, played turn 1): The Pack Grows — Ward. At the start of their turn, their weakest army member gets +1/+1 permanently.
  - 2x Wolf Pup `pup` — 1 mana, Army 1/2 💀1. Pack
  - 3x Grey Wolf `wolf` — 2 mana, Army 2/3 💀1. Pack
  - Hati, the Moon-Chaser `hati` — 3 mana, Army 3/4 💀2. Pack, Range
  - Skoll, the Sun-Chaser `skoll` — 3 mana, Army 3/3 💀2. Pack, Charge
  - Fenrir, the Unbound `fenr` — 5 mana, Army 6/6 💀4. Pack, Bulldoze

**The Jotnar** 🏔️ — base life 15, 9-card deck. Hint: "Huge frost giants and endless winter".
  Mini-trump (starts in hand, played turn 1): Rimewall — Ward. Combat damage dealt to their Giants is reduced by 1.
  - 4x Frost Thrall `ithrl` — 1 mana, Army 2/3 💀1
  - 3x Rime-Witch `rimew` — 2 mana, Army 2/3 💀1. When it enters, tap target army member.
  - Hill Giant `hgnt` — 2 mana, Army 3/5 💀2. Giant
  - Ice Spear `icesp` — 2 mana, Spell. Deal 4 damage to target army member (more in later fights).

**The Dwarven Forge** ⚒️ — base life 15, 15-card deck. Hint: "Items and modifiers that forge their army".
  Mini-trump (starts in hand, played turn 1): The Forge-Fire — Ward. Whenever they play an item or modifier, their strongest army member gets +1/+1 permanently.
  - 2x Dwarf Miner `dmin` — 1 mana, Army 1/2 💀1. Forged
  - 3x Dwarf Smith `dsmith` — 2 mana, Army 1/3 💀1. Forged
  - 3x Dwarf Crossbowman `dxbow` — 2 mana, Army 2/2 💀1. Forged, Range
  - Brokkr, the Master Smith `brokk` — 3 mana, Army 2/4 💀2. Forged. When it enters, draw a card.
  - Iron Golem `golem` — 4 mana, Army 3/6 💀3. Forged, Resilient
  - Anvil of Eitri `anvl` — 2 mana, Item. Your Forged army members get +1/+1.
  - Dwarf-Forged Shield `dshld` — 3 mana, Item. Your Forged army members have Resilient.
  - Draupnir, Ring of Gold `drpn` — 4 mana, Item. At the start of your turn, gain 1 extra mana.
  - 2x Dwarven Bolt `dbolt` — 3 mana, Spell. Deal 4 damage to target army member (more in later fights).

**Muspelheim** 🔥 — base life 15, 14-card deck. Hint: "Fire giants and burning blades: a race against your life".
  Mini-trump (starts in hand, played turn 1): Scorched Earth — Ward. At the start of each of your turns, you lose 1 life.
  - 3x Ember Sprite `ember` — 1 mana, Army 2/1 💀1. Charge
  - 3x Flame Raider `fraid` — 2 mana, Army 3/2 💀1. Charge
  - 2x Lava Hound `lava` — 2 mana, Army 2/3 💀1. Ruthless
  - 2x Muspel Giant `mgnt` — 3 mana, Army 4/4 💀2. Ruthless
  - Surtr, Lord of Muspelheim `surtr` — 4 mana, Army 5/5 💀4. Ruthless, Charge
  - 2x Searing Bolt `fbolt` — 2 mana, Spell. Deal 3 damage to the opposing player (more in later fights).
  - Molten Spear `mspear` — 2 mana, Spell. Deal 3 damage to target army member (more in later fights).

**Hel's Legion** 💀 — base life 15, 12-card deck. Hint: "The restless dead drain and refuse to stay down".
  Mini-trump (starts in hand, played turn 1): Corpse-Cold — Ward. At the start of each of your turns, each of your army members that has damage on it takes 1 more damage.
  - 4x Draugr `draug` — 1 mana, Army 1/3 💀1. When it dies, return it to your hand as a Risen Draugr.
  - 2x Barrow-Wight `wight` — 2 mana, Army 2/2 💀1. Draining
  - 3x Hel-Guard `hgrd` — 2 mana, Army 2/4 💀1. Resilient
  - Nidhogg, the Corpse-Gnawer `nidh` — 4 mana, Army 4/5 💀3. Draining, Venomous
  - 2x Grasp of the Grave `hgrasp` — 2 mana, Spell. Destroy target army member that has damage on it.

**Loki's Court** 🎭 — base life 15, 14-card deck. Hint: "Bounce, tap and trickery".
  Mini-trump (starts in hand, played turn 1): Loki's Toll — Ward. The first spell you cast each turn costs 1 more.
  - 2x Loki's Raven `lrav` — 2 mana, Army 1/2 💀1. Flying. When it enters, draw a card.
  - 3x Sly Imp `imp` — 2 mana, Army 2/2 💀1
  - 2x Skin-Changer `skinw` — 3 mana, Army 3/3 💀2. When it enters, return the strongest opposing army member to its owner's hand.
  - Loki, the Shapeshifter `lokis` — 5 mana, Army 4/5 💀3. When it enters, return the strongest opposing army member to its owner's hand and draw a card.
  - Loki's Trick `lsnare` — 2 mana, Spell. Tap target army member; it doesn't untap next turn.
  - Loki's Mischief `lcurse` — 2 mana, Spell. Target army member gets -2/-2 permanently (more in later fights).
  - 2x Wind of Mischief `lgale` — 2 mana, Spell. Return target army member to its owner's hand.
  - 2x Barbed Words `lokib` — 3 mana, Spell. Deal 3 damage to target army member (more in later fights).

Elites:

**The Norns** 🔮 (ELITES[2]) — base life 13, 10 cards. Hint: "Each turn they foretell their costliest card, and it is played free next turn. Plan around what is coming".
  Trump: The Well of Urd — Ward. At the end of their turn, they foretell the most expensive card in their hand that they could play (cost 2 or more): it is shown to you, set aside face up, and played free at the start of their next turn, before anything else.
  - Urd, Keeper of the Past `urd` — 3 mana, Army 2/4 💀2. When it enters, return a random army member from your graveyard to your hand.
  - 2x Verdandi, Weaver of the Present `verd` — 2 mana, Army 2/3 💀1. Range. When it enters, tap the strongest opposing army member.
  - Skuld, Maiden of the Future `skuld` — 4 mana, Army 3/5 💀3. Resilient. When it enters, draw a card.
  - 4x Thread-Spinner `nspin` — 1 mana, Army 1/3 💀1
  - Doomed Warrior `nwarr` — 2 mana, Army 3/3 💀1. Ruthless
  - Doom Decree `ndoom` — 3 mana, Spell. Deal 4 damage to target army member.

**Fáfnir, the Hoard-Dragon** 🐲 (ELITES[3]) — base life 21, 13 cards. Hint: "Every army member he plays adds Gold to the Hoard, and the Dragon grows with it. Kill the Dragon before the Hoard fills".
  Trump: The Hoard of Andvari — Ward. Whenever they play an army member, a Gold is added (up to 3). Fáfnir gets +1/+1 for each Gold. Gold: 0/3
  - Fáfnir, the Hoard-Dragon `fafn` — 4 mana, Army 4/5 💀3. Ruthless, Venomous, Resilient. Gets +1/+1 for each Gold in the Hoard.
  - 4x Hoard-Guard `fgrd` — 1 mana, Army 1/2 💀1
  - 3x Lindworm `fworm` — 2 mana, Army 3/2 💀1. Ruthless
  - 2x Regin, the Smith `regin` — 3 mana, Army 3/4 💀2. When it enters, draw a card.
  - Dragon's Breath `dbrth` — 4 mana, Spell. Deal 2 damage to each opposing army member.
  - 2x Venom Spit `fspit` — 2 mana, Spell. Deal 4 damage to target army member.

Bosses:

**Jörmungandr, the World Serpent** 🐍 (BOSS[3]) — life 22, scaling sc=[0,0,0], 13 cards.
  Trump (on battlefield from the start): Ouroboros — Ward. Whenever you attack, the attacking army member with the highest cost (3 or more) that survives returns to your hand after combat.
  Flavor: "Before the first ship was launched, the Allfather cast a child into the sea, and the sea grew round it until it circled the world with its tail in its jaws. Nothing in the deep is in a hurry, and what you raise against the serpent is lifted by the tide and carried back to shore, the greatest weapons first. No small hook has ever tempted it, but when Thor went fishing with an ox's head for bait, it rose and swallowed the finest thing within reach. For one breath it hung above the water with its throat bare, and the Thunderer's hammer was already raised. Cheap hooks it ignores, so bring a bait worth the swallowing and a blow ready for the moment it surfaces."
  - 4x Sea-Snake `jsnk` — 1 mana, Army 1/3 💀1. Venomous
  - 3x Brine-Wyrm `jcrw` — 3 mana, Army 3/5 💀2. Resilient
  - Jörmungandr, the World Serpent `jorm` — 5 mana, Army 6/9 💀3. Venomous, Resilient. When it rises, it is tapped. It swallows the opposing army member that costs the most (4 or more).
  - 2x The Deep Takes Back `jbck` — 2 mana, Spell. Return target army member to its owner's hand.
  - 2x Drowning Grip `jgrp` — 2 mana, Spell. Tap target army member; it doesn't untap next turn.
  - Venom Spray `jspt` — 3 mana, Spell. Deal 3 damage to target army member (more in later fights).

**The Wild Hunt** 🌩️ (BOSS[4]) — life 22, scaling sc=[0,0,0], 9 cards.
  Trump (on battlefield from the start): The Wild Hunt — Ward. At the start of its turn, the Hunt marks your strongest army member as the Quarry. Hunt riders deal 3 extra damage to the Quarry. A rider that kills the Quarry gets +1/+1 for the rest of the fight, and the Hunt draws a card.
  Flavor: "When the Allfather walks the world as the Wanderer, the Wild Hunt rides without its master, a storm of horns, hounds and pale riders loosed across the winter sky. It does not chase the herd; it names the tallest of them, and the whole night turns toward that single name. Once the horn has sounded, the hunted is pinned in place, and what is pinned does not run, it falls. Every kill feeds the riders, who return from each hunt faster and hungrier than before. The old huntsmen of the north said that no man outruns the Hunt, but he who hides among lesser men may be passed over."
  - 2x Hel-Hound `hhnd` — 1 mana, Army 2/1 💀1. Charge
  - 2x Phantom Rider `hrdr` — 2 mana, Army 3/2 💀1. Flying
  - Wild Huntsman `hwld` — 2 mana, Army 3/3 💀1
  - Huntmaster of the Gandreid `hmst` — 3 mana, Army 4/4 💀2. Flying, Charge
  - 2x Horn of the Hunt `hhrn` — 1 mana, Spell. Tap target army member; it doesn't untap next turn.
  - Hunter's Spear `hhbt` — 2 mana, Spell. Deal 3 damage to target army member (more in later fights).

**Hrungnir, the Stone-Hearted** 🗿 (BOSS[5]) — life 24, scaling sc=[0,0,0], mp=3, 9 cards.
  Trump (on battlefield from the start): The Holmgang — Ward. A duel: each side may have only 2 army members in play (one to attack, one to defend), and may attack with only one and block with only one.
  Flavor: "Hrungnir, mightiest of the giants, rode drunk into Asgard and swore that he would carry off Freyja and sink Valhalla into the sea. The gods did not storm his hall; they named a place and an hour and offered him a duel, one champion against one. The giants raised a champion of clay nine leagues tall to stand beside him, but it was given only a mare's heart, and it shook as the thunder came near. Hrungnir had a head of stone, a heart of stone and a shield of stone, and he stood upon that shield because he had been told his enemy would strike from below. Thor came down out of the clouds instead."
  - Hrungnir, the Stone-Hearted `hrung` — 4 mana, Army 5/6 💀3. Resilient. Stone shield: takes 2 less combat damage from army members that do not fly.
  - Mökkurkálfi, the Clay Giant `hmokk` — 4 mana, Army 3/8 💀2. Can only defend. Clay: takes 2 extra combat damage. It can only defend.
  - 3x Rock-Troll `htrl` — 2 mana, Army 3/3 💀1
  - 2x Gravel-Giant `hgrt` — 3 mana, Army 4/4 💀2
  - Whetstone `hwhet` — 3 mana, Spell. Deal 4 damage to target army member (more in later fights).
  - Giant's Mead `hmead` — 2 mana, Spell. Gain 4 life. Restore 2 health to each of your army members.

### 6.3 Wukong realm (the Western Heaven)

Regular enemies:

**The Spider Cave** 🕷️ — base life 15, 14-card deck. Hint: "Webs bind your attackers and silk wards off your spells".
  Mini-trump (starts in hand, played turn 1): Cobweb — Ward. The first army member that attacks each turn does not untap next turn.
  - 5x Cave Spiderling `spd1` — 1 mana, Army 2/1 💀1. Flying
  - 3x Silk-Spinner `spd2` — 2 mana, Army 3/4 💀1. Ward. When it enters, tap the strongest army member the opponent controls.
  - 2x Web-Weaver `spd3` — 3 mana, Army 4/3 💀2. Ruthless. When it dies, deal 1 damage to each opposing army member.
  - 2x Spider-Spirit Matron `spdq` — 4 mana, Army 5/5 💀2. Ruthless. When it enters, two Cave Spiderlings join the army if there is room.
  - 2x Cocoon `cocn` — 2 mana, Spell. Tap target army member; it doesn't untap next turn.

**The Gold and Silver Horn Kings** 🏺 — base life 15, 11-card deck. Hint: "A gourd that swallows the first spell aimed at them".
  Mini-trump (starts in hand, played turn 1): Gourd of Names — Ward. The first spell you cast each turn that targets one of their army members is swallowed: it does nothing.
  - 3x Horn Soldier `hsol` — 1 mana, Army 2/1 💀1. When it dies, the opponent takes 1 damage.
  - 3x Cave Captain `hcap` — 2 mana, Army 2/3 💀1. When it enters, draw a card.
  - 2x Silver Horn King `hsil` — 3 mana, Army 3/3 💀2. Ruthless. When it enters, deal 2 damage to the opposing army member with the least life.
  - Gold Horn King `hgol` — 4 mana, Army 4/5 💀3. When it dies, the opponent takes 3 damage.
  - Humbling Rope `hrope` — 2 mana, Spell. Target army member gets -2/-2.
  - Jade-Purity Bottle `hbot` — 3 mana, Spell. Deal 4 damage to target army member.

**The Heavenly Host** ☁️ — base life 15, 10-card deck. Hint: "Celestial soldiers under a decree that taxes your first army member".
  Mini-trump (starts in hand, played turn 1): Heavenly Decree — Ward. The first army member you play each turn costs 1 more.
  - Heavenly Soldier `hsd` — 1 mana, Army 2/3 💀1. Flying. When it dies, the opponent takes 1 damage.
  - 2x Celestial Hound `hhd` — 2 mana, Army 3/3 💀1. Opportunist. When it enters, deal 1 damage to the opposing army member with the least life.
  - 2x Heavenly General `hgn` — 3 mana, Army 4/4 💀2. Ward. When it enters, your other army members get +1/+0 until end of turn.
  - 2x Nezha, the Third Prince `hnz` — 3 mana, Army 3/3 💀2. Charge
  - 2x Pagoda-Bearing King `hpg` — 4 mana, Army 3/6 💀3. Resilient. When it enters, tap the strongest army member the opponent controls.
  - Jade-Purity Bottle `hbot` — 3 mana, Spell. Deal 4 damage to target army member.

**Red Boy** 🔥 — base life 15, 10-card deck. Hint: "True Samadhi Fire scorches every blocker".
  Mini-trump (starts in hand, played turn 1): True Samadhi Fire — Ward. Army members that block their army members take 1 damage first.
  - 3x Fire-Wheel Imp `rimp` — 1 mana, Army 2/1 💀1. Charge. When it dies, the opponent takes 1 damage.
  - 4x Samadhi Guard `rgrd` — 2 mana, Army 2/2 💀1. When it enters, the opponent takes 1 damage.
  - Fire-Cloud Spearman `rspr` — 2 mana, Army 3/2 💀2. Ruthless. When it enters, deal 1 damage to the opposing army member with the least life.
  - Red Boy, the Holy Infant King `rboy` — 3 mana, Army 4/4 💀3. Charge. When it enters, deal 1 damage to each opposing army member.
  - Fire-Cloud Blast `rflm` — 2 mana, Spell. Deal 3 damage to target army member.

**The White Bone Spirit** 💀 — base life 15, 12-card deck. Hint: "She sheds her corpse and returns: the first of her fallen each turn comes back to her hand".
  Mini-trump (starts in hand, played turn 1): Corpse-Shedding Form — Ward. The first of their army members to die each turn returns to their hand instead.
  - 3x Bone Soldier `bsk` — 1 mana, Army 2/2 💀1
  - 3x Wandering Corpse `bghl` — 2 mana, Army 2/3 💀1. When it enters, draw a card.
  - 3x The Old Hag `bhag` — 3 mana, Army 3/4 💀2. When it enters, the strongest opposing army member takes 2 damage.
  - The White Bone Spirit `bsp` — 4 mana, Army 4/5 💀3. Resilient. When it enters, return an army member from your graveyard to your hand.
  - 2x Humbling Rope `hrope` — 2 mana, Spell. Target army member gets -2/-2.

**The Yellow Wind Ridge** 🌪️ — base life 15, 12-card deck. Hint: "Everything the wind carries strikes the moment it lands".
  Mini-trump (starts in hand, played turn 1): The Yellow Wind — Ward. All of their army members have Charge.
  - 3x Wind-Riding Bat `ybat` — 1 mana, Army 2/2 💀1. Flying, Charge. When it enters, the opponent takes 1 damage.
  - 3x Tiger Vanguard `ytig` — 2 mana, Army 3/2 💀1. Charge. When it dies, draw a card.
  - 3x Ridge Guard `ydef` — 2 mana, Army 2/3 💀1. Charge. When it enters, the opponent takes 1 damage.
  - The Yellow Wind Monster `ygen` — 4 mana, Army 4/4 💀3. Flying, Charge. When it enters, deal 1 damage to each opposing army member and tap the strongest one.
  - 2x Three-Sacrifice Gale `ygale` — 2 mana, Spell. Deal 3 damage to target army member.

Elites:

**Erlang Shen, the Three-Eyed** 👁️ (ELITES[4]) — base life 21, 12 cards. Hint: "His third eye sees through every clone and feint: spells that cost 0 cost 1 more for you".
  Trump: The Third Eye — Ward. Spells and instants that cost 0 cost 1 more for you.
  - 4x Plum Mountain Brother `eplum` — 2 mana, Army 2/3 💀1
  - 3x The Howling Celestial Hound `ehnd` — 2 mana, Army 3/3 💀1. Opportunist
  - 2x Erlang Shen, the Illustrious Sage `eerl` — 4 mana, Army 4/5 💀3. Resilient
  - 2x Three-Pointed Blade `esw` — 3 mana, Spell. Deal 4 damage to target army member.
  - Heaven-and-Earth Net `hnet` — 3 mana, Spell. Tap all opposing army members.

**Princess Iron Fan** 🪭 (ELITES[5]) — base life 17, 9 cards. Hint: "Her fan blows your priciest army member back to your hand every turn: win with cheap bodies and spells".
  Trump: The Banana-Leaf Fan — Ward. At the start of their turn, the most expensive army member you control that costs 2 or more is blown back to your hand.
  - 2x Wind Spirit `iwnd` — 1 mana, Army 2/1 💀1. Flying
  - 3x Fan Maiden `imaid` — 2 mana, Army 2/3 💀1
  - 2x Palm-Leaf Guard `iguard` — 3 mana, Army 3/4 💀2. Phalanx
  - Princess Iron Fan `iprin` — 4 mana, Army 4/5 💀3. Resilient
  - Heaven-and-Earth Net `hnet` — 3 mana, Spell. Tap all opposing army members.

Bosses:

**The Six-Eared Macaque** 🐵 (BOSS[6]) — life 20, scaling sc=[0,0,0], 10 cards.
  Trump (on battlefield from the start): The Second Self — Ward. The first army member you play each turn is mimicked: a copy joins their army if there is room, and vanishes for good when it dies.
  Flavor: "When the Great Sage returned to the Western road, a second Sun Wukong stood beside the pilgrim, matching him in staff, face and temper, and not even the Bodhisattva could tell them apart. The Macaque of the six ears hears every whisper in heaven, and he learns each of your moves the moment you make it. Whatever you send first onto the field he mirrors, one shadow for each turn, though a shadow that falls does not rise again. Only the Buddha's own ear could name the true one, because the false Sage can copy a body but never the order of its plans. Send a small thing ahead of the great one, or strike with spells that cast no shadow at all."
  - 3x Shadow Monkey `mmon` — 1 mana, Army 1/2 💀1
  - 3x Mimic Ape `mape` — 2 mana, Army 3/2 💀1. Opportunist
  - 2x Listening Ear `mear` — 3 mana, Army 2/5 💀2. When it enters, draw a card.
  - The Six-Eared Macaque `mac6` — 4 mana, Army 5/5 💀3. Resilient
  - Echo of the Staff `mecho` — 2 mana, Spell. Deal 3 damage to target army member.

**The Bull Demon King** 👹 (BOSS[7]) — life 24, scaling sc=[0,0,0], 11 cards.
  Trump (on battlefield from the start): Fury of the Bull — Ward. At the start of their turn, each of their army members gets +1/+0 until end of turn.
  Flavor: "The Bull Demon King was sworn brother to the Monkey King for five hundred years, and styled himself the Great Sage Who Pacifies Heaven. Every dawn his rage is rekindled, and each of his horned captains charges with the strength of two. That fury burns only through the hours of his own turn, so a wall thick enough will break it as a wave breaks on stone. His hide is the toughest in the west, and no single blow has ever felled him at his strongest. Meet the charge on ground you choose, and strike his lines while his fury sleeps."
  - 3x Bull Guard `bgrd` — 2 mana, Army 2/4 💀1
  - 3x Buffalo Captain `bcap` — 3 mana, Army 4/4 💀2. Ruthless
  - 2x Horned Vanguard `bhrn` — 4 mana, Army 5/4 💀2. Charge
  - The Bull Demon King `bdk` — 5 mana, Army 6/7 💀3. Resilient
  - 2x Fire-Cloud Blast `rflm` — 2 mana, Spell. Deal 3 damage to target army member.

**The Buddha's Palm** 🖐️ (BOSS[8]) — life 24, scaling sc=[0,0,0], 11 cards.
  Trump (on battlefield from the start): The Five-Finger Mountain — Ward. Each card you play after the third in a turn costs 2 more.
  Flavor: "After the Monkey King boasted that he could leap to the ends of the earth, the Buddha laid out his palm and bade him try. Five pillars of flesh rose to the sky, and the Sage, who thought he had reached the world's edge, had only scrawled his name on a finger. The mountain does not hurry, and it answers a crowd with the same stillness as a single man. Those who swarm it find their third step easy and their fourth heavy, as if the whole sky leaned upon them. Choose three deeds well and let each one count."
  - 3x Stone Disciple `pdis` — 1 mana, Army 1/3 💀1
  - 3x Finger of the Mountain `pfin` — 2 mana, Army 2/5 💀1. Phalanx
  - 2x Mountain Warden `pgrd` — 3 mana, Army 3/6 💀2
  - The Buddha's Palm `plm` — 5 mana, Army 5/9 💀3. Resilient
  - Cocoon `cocn` — 2 mana, Spell. Tap target army member; it doesn't untap next turn.
  - Jade-Purity Bottle `hbot` — 3 mana, Spell. Deal 4 damage to target army member.

---

## 7. Roguelike structure

**Character select.** Choose from three hero boxes, each with a "see full library" button. The title screen says MYTHOLOGICA in big bold letters.

**Starting draft:**
- 11 rounds of 3 random cards, pick 1. The 4 staples are added automatically, making a 15-card deck.
- Offers are weighted random. Duplicates are possible and some cards may never appear.
- Rarity weights `RW`: C 6, U 3, R 1, L 0.18.
- Synergy bias: each card's weight is multiplied by (1 + min(2, 0.3 × the number of drafted cards sharing its archetype tag)).
- Curve bias for army members: cheap cards are pushed when the offered curve runs high, and expensive cards when it runs low.
- Non-Wukong drafts always include at least one army member among the 3.
- A picked card flies to the face-down library pile at left for 1 second, then there is a 1-second pause before the next 3. You can click the library to view it.

**Map (`genWeb`):**
- A web/maze of 25 nodes: the centre start, then rings of 5, 8 and 11.
- Connections are random and never cross: a spanning tree plus extra edges.
- 15 fight nodes, each showing its opponent's icon. 2 of the 15 are elites.
- Plus 3 Campfires, 3 Crafting tables and 3 Altars.
- Nodes show icons only, with hover text. Non-fight nodes can be used once (Leave closes them).
- You move only along edges, and travelled edges are drawn as a trail.
- Defeating an opponent neutralizes the other nodes holding that same opponent.

**Currencies:**
- Action points (AP): start at 2. +2 per regular win, +3 per elite win.
- Victory points (VP): +1 per win.
- Reaching **4 VP** (`FLOORS=4`):
  - gives "A Gift from the One True God", +2 AP;
  - closes all remaining fight nodes;
  - turns the centre into the **Altar to the One True God**.
- Offer the 4 VP there to see 2 of the hero's 3 bosses at random, each with its 5-sentence flavor text. Pick one to fight.
- So a run is 4 fights in Act 1 (any mix of regular and elite) plus a boss.

**Fight rewards:**
- Regular win: +1 VP, +2 AP.
- Elite win: +1 VP, +3 AP, and an immediate free draft with better rare odds (`RWE`: C 0.4, U 3.5, R 5, L 1.8).
- After every win comes the Prestige/glory step: each surviving army member picks 1 of 2 upgrades.

**Locations:**
- **Campfire**: 1 AP heals 6 life, never above max. Up to 2 times.
- **Crafting table**: 1 AP to draft a card, using reward weights `RW2` (C 1, U 4, R 3.5, L 1.1), repeatable. 1 AP to remove a card (click it, then "Are you sure?" yes/no), repeatable.
- **Altar**: 1 AP to duplicate a card (once). Duplicating a Rare costs 2 AP. 1 AP to upgrade any card with a Prestige option (once). Legendaries can't be duplicated or upgraded here.

There is no automatic healing between fights. History: earlier versions healed 2 per fight, then offered "gain 6 health" as a post-win option.

**Act 2** (`startAct2`):
- Starts after the Act 1 boss win.
- `a2Realm()` picks a random other hero's realm, then the map regenerates with that realm's enemies, elites and bosses.
- +10 life (capped at max), new intro text, AP and VP reset, same 4-VP structure.
- Winning the Act 2 boss gives the victory screen (there is no Act 3 yet).

**Planned campaign ("hybrid realms"):**
- Act 1: the hero's home realm.
- Act 2: a random other realm.
- Act 3: an amalgam of all realms, with 3 final bosses shared by every hero.
- Act 4: an eventual very hard act that ties the story together.

**Meta-progression:** none yet. There are no events either; the map only has the node types above.

---

## 8. Balance

**Targets:**
- Fight-1 bot win rate: 32–36%, with 28–41% acceptable.
- Each later fight about 3 points lower.
- Regular fights for one hero should be about evenly hard (within roughly one standard deviation).
- Elites a bit harder, but not by much.
- Ben prefers quick fights. Enemy life is the easy lever, since it barely affects difficulty.
- Balance matters more than thematic synchronicity.
- When asked for a change, make it without rebalancing unless it clashes with something.

**Simulation.** `sim.js` loads the built HTML in a Node `vm`, stubs waits and reveals, and runs `bot.js`, a scripted competent player.
- The bot drafts through `planScore` / `cardVal` heuristics (`RATE` table) and has per-hero planners (`planOdin`, `planWk`).
- It runs N full runs and reports win% per fight, turns, average life on a win, and stalls (fights that hit the turn cap).
- Environment variables:
  - `CHAR=ody|odin|wukong`.
  - `OPP=n`: only fight-1 vs enemy n. 100+i forces elite i; 200+i forces boss i.
  - `REALM`, `ACT2=1`, `TRACE=1` (log every action), `PATCH`='js to run first', `DMODE`.
- Helpers:
  - `runset.sh html tag N "char:opp …"` runs 2 in parallel and writes `rs_<tag>.txt`.
  - `bossv.sh` (boss vetting with a boosted deck), `cfa.sh`, `dv.sh`, `hostv.sh`, `act2.sh`.
  - `cardval.py` / `mk_tier*.py` (tier lists: win% of runs containing each card, against the mean).
- The noise is large: ±4 points at N=150 and ±2.4 at N=400. Use 300+ runs before changing anything.

**Latest fight-1 bot win rates** (v97, N=150 each, enemy order as listed in section 6):
- Odysseus:
  - Lotus-Eaters 27
  - Sirens 34
  - Polyphemus 35
  - Shades 29 (33 stalls, avg 16.8 turns)
  - Phaeacians 29
  - Cicones 38
- Odin:
  - Fenrir's Brood 35
  - Jotnar 35 (20 stalls)
  - Dwarven Forge 40
  - Muspelheim 36
  - Hel's Legion 24
  - Loki's Court 45
- Wukong:
  - Spider Cave 27 (36 at N=400 after the v97 -1 life change, so treat it as about 31±5)
  - Horn Kings 36
  - Heavenly Host 41
  - Red Boy 27
  - White Bone 36
  - Yellow Wind 41

Outside the acceptable 28–41% band: Odin vs Loki's Court (45, too easy) and Odin vs Hel's Legion (24, too hard). Odysseus vs the Lotus-Eaters and Wukong vs Red Boy (27) are at the low edge.

**Latest Odin tier list** (October 20, before Wukong existed: win% of runs containing the card, then delta from the 39.5% mean):
- Top: Uruz +8.4, Thegn of the Hall +8.0, Fehu +7.8, Host of Valhalla +7.7, Sleipnir +7.3, Bear-Shirt Berserker +7.2, Skar the Scarred +7.0, Battlefield Scavenger +6.2, Last Stand of the Doomed +5.3, Skaldic Bard +4.6.
- Bottom: Pyre of Heroes -12.3, Mimir's Well -7.6, Skull-Cleaver -7.2, Starkad -7.0, Baldr -5.9, Hall-Guard -5.1, Blood-Drinker -4.5, Egil -4.1, Sigurd -4.0, Volund -3.9.
- Tier counts: S1 A10 B21 C25 D17. Archetype run rates: B 0.36, V 0.40, H 0.45 (Runes strongest).
- No Wukong tier list exists yet, and the Odysseus list is older still. Both should be regenerated.

**Recent tuning:**
- v97 added `CFA.wukong[0]=[-1,0,0]`.
  - Cause: the enemy offering-AI fix made enemies slightly stronger.
  - It dropped Wukong vs the Spider Cave from 34 to about 27.
  - -3 life overshot to 41, so -1 was used.
- Earlier passes tuned CFA/CFAE per hero and fight, the boss decks (vetted with `bossv.sh`), Act 2 XADJ and the Iron Fan elite.

**Known bot / AI weaknesses:**
- The enemy AI sometimes declines to attack when it should; this flakes in block-phase tests on ody and wukong.
- Stall-heavy matchups (Shades, Jotnar, Odin vs Fenrir and Hel) show both bots turtling. Enemy decks of 8–9 cards can run dry because enemies don't reshuffle.
- The player bot undervalues Pyre of Heroes and Mimir's Well. Their tier scores may reflect the bot more than the cards.
- The AI deliberately does **not** account for the player's possible quick spells when checking lethal (Ben's rule), but it does consider whether it can block.
- The enemy AI aims to deal as much damage to the player as possible (Spire-style), not to preserve itself. It takes lethal first and protects itself only when that makes sense.

---

## 9. Code architecture

**Source and build.** The published HTML is a build product, made by a patch pipeline. All of it is in **`mythologica-tooling.zip`**, delivered with this document. It rebuilds the published v97 script byte-for-byte; that was verified.
- `build.py` starts from `before_step12.html` and injects `engine_a.js`, `engine_b.js` and `data_new.js`.
- It then execs `patch_data.py` and `patch2.py` … `patch40.py` in order. Each patch uses `_b3(old,new)`, which asserts exactly one match, to string-replace code.
- Patches also splice in `odin.js`, `odinboss.js`, `minitrump.js`, `web.js`, `rendermap.js`, `upgs.js`, `elites.js`, `wukong.js` (includes the phone block), `mapcss.css` and `webcss.css`.
- Finally the army-cap literal `5` becomes `AM()`.
- `rebuild.sh` → `n1.html` + `g.js` + `node --check`.
- `build.py` and `runset.sh` hard-code the old sandbox path in `S=` / `cd`. Change these to the repo path.

**Recommended next step:** freeze the patch stack. Commit the built HTML as `index.html` and make it, or a module split of it, the single source of truth. Editing through 40 sequential string-replace patches is fragile. Until then, every new change can go in as `patch41.py`.

**File layout** (one `<script>` plus one `<style>`):
- **`D`**: the card table. Each entry is
  `id: [name, cost, type, power, health, flags, text, emoji, colour, sacrifice]`
  - `type`: C / I / S / E / A.
  - `flags`: a string of keyword letters (section 3).
  - `text`: legacy rules text, overridden by `TXT` / `DYN`.
  - `colour`: one of W U B R G N A E. It is a frame colour hint, not used for rules.
  - `sacrifice`: the 💀 value, army members only.
- Lookup tables:
  - **`TXT`**: rules text by id.
  - **`DYN`**: functions `c => text` for live text, e.g. scaled damage or Disintegrate counts.
  - **`LORE`**: the type-line lore phrase.
  - **`TAG`**: archetype letter by id.
  - **`ARCH`**: letter to archetype name.
  - **`RAR`** / **`RARN`** / **`RARX`**: rarity.
  - **`KWL`** / **`KWT`**: keyword long / short text.
  - **`GLS()`** / **`GLX`**: glossary regexes for hover pop-ups.
  - **`TYX`**: type explanations.
  - **`UPS`**: "stronger effect" upgrade text.
  - **`KO`**: upgrade options.
  - **`IV`**: AI value of items and modifiers. Trumps are 40.
  - **`STAPLES`** / **`POOL`**: Odysseus's lists, also mirrored in `CHARS`.
- **`CHARS`**: the hero registry, `{n, ic, quote, play, arch:[[letter,name]…], staples, pool, en, bo, el}`. `en` = regular enemies, `bo` = indices into `BOSS`, `el` = indices into `ELITES`.
  - `setChar(k)` swaps the globals `EN`, `STAPLES`, `POOL`, `RARX` …
  - `CH` is the current hero.
- **`EN`**: the current hero's regular enemies, each `{n, l, ic, hint, bg:[c1,c2], mt, d:ids('id:count,…')}`.
- **`ELITES`**: entries add `mt` (the elite trump).
- **`BOSS`**: entries add `sc`, `trump`, `lore`, and optionally `mp`.
- Scaling tables: **`SCL`**, **`CFA`**, **`CFAE`**, **`XADJ`**, **`BOSSX`** (section 6).
- Effect registries, keyed by card id:
  - **`FX`**: spell effects `(s,o,t)`.
  - **`ETB`**: enter-the-battlefield effects.
  - **`DEATH`**: death triggers.
  - **`SPA`**: maps a card id to the id whose AI plan/effect it reuses, e.g. nshade → hurl.
- **`G`**: the global run and fight state.
  - Run fields: `ch, fi` (fights won), `act` (AP), `web`, `pos`, `rt`, `boss`, `bi`, `elt`, `a2`, `phase`.
  - Fight fields: `p`, `e` sides `{life, max, mana, deck, hand, bf, gy, recs}`, `cmb`, `sel`, `tg`, `mode`, `rv`, `qp`.
  - A card instance comes from `mk(id, rec)` and has `u` (uid), `dmg`, `tap`, `def`, `sick`, `frz`, `a/d` (stat mods), `rec` (persistent upgrades) and other fields.
  - `p.recs` is the run deck: records `{id, a, d, c, s, k, fl, m}` holding Prestige upgrades.

**Key functions:**
- Run flow: `newRun`, `dealDraft` / `pickDraft` / `finishDraft`, `genWeb` / `goNode` / `nodeTip`, `fight`, `startHand`, `startP`, `upkeep`, `cast`, `offer`, `stance`, `resolve`, `enter`, `bury`, `onDie`, `chk` (death/state checks), `sweep`, `clean`.
- AI: `enemyTurn` (async; pauses with `wait`) and `attackPlan` / `combatEval` / `pickBlocks` / `aiBlock`.
- Act structure: `bossPick` / `bossStart`, `otgInit` / `otgOffer`, `startAct2` / `a2Realm` / `applyRealm`.
- Odin: `bloodPrice`.
- Wukong: `wkPlay` / `wkMom` / `wkShuffle`.
- Norns: `foretell` / `foreIn`.
- Rendering: `render` → `render0`, which dispatches on `G.phase` (char, map, loc, draft, remove, hub, nextf, otg, bossp, main, blockP, dmgP, kleos, enemy, lost, victory).
- Save / undo: `persist` / `readSave`, and `snapG` / `doUndo` for undo.

**Enemy AI** (`enemyTurn`):
1. Untap and upkeep, then draw. Mana = 2 (or `mp`) plus hand bonuses.
2. Play the foretold card first (Norns).
3. Loop:
   - score every affordable card with `planScore`;
   - offer creatures (the "offer" branch) only when it unlocks a clearly better card, or when a creature is doomed (damaged with 1 health effectively left);
   - play the top-scoring card (`G.eForce` commits it to the card it offered for);
   - reveal non-army cards and wait for OK;
   - pause 3 seconds (5 for Norns) between actions.
4. Choose stances, then `attackPlan`: lethal first, otherwise maximise damage. It weighs targeting tapped units and evaluates trades with `combatEval`.
5. On your attacks, `pickBlocks` / `aiBlock` choose blocks.

`TELEM` / `CNT` hold telemetry used by the sim.

**UI and layout:**
- Grid layout. The left column, top to bottom: enemy graveyard, enemy library, player library, player graveyard.
  - The enemy hand shows as card backs.
  - Clicking your library opens an OK-dismiss overlay sorted by rarity then cost, not draw order.
- The battlefield is layered by y-position only; each creature keeps its own x slot in a single row. From the player's side toward the enemy: items/modifiers (right column), tapped, defense form, attack form, blocking.
- Cards grow 30% on hover.
- `fit()` / `fitHand()` scale everything so the page never scrolls.
- On desktop the board and cards are 25% bigger, and labels and buttons 40% bigger.
- Enemy life bar and army count are at top left. Buttons are at bottom right: Attack, Attack with all, End turn, Blood price (Odin), Use quick spell.

**Phone mode** (in the `PHONE MODE` block):
- Landscape only. Portrait shows a "rotate your phone" prompt (`#rotp`).
- Classes: `html.ph` / `phl` (landscape phone), `phr` (portrait), `phk` (glory screen).
- CSS variables `--fw`, `--hw`, `--vh`.
- Mini cards. First tap opens a magnified copy (`#loupe` over the `#lbk` backdrop); a second tap on the card or its original spot performs the action, and tapping elsewhere closes it. Map nodes use the same two-tap pattern.
- "Click" text is rewritten to "Tap", and `.sb` stance labels are shortened.
- The stance label sits above the card so it doesn't cover the name: `top:-21px` on desktop, `-20px` on phone.

**Quirks / tech debt:**
- The patch-stack history left dead code: `renderCharOld`, `renderNextf` (the old linear "Next fight" screen) and `build_old` remnants.
- Hero-specific behaviour is branched with `G.ch` checks scattered throughout.
- Odysseus data is the oldest. Some of his `D[id][6]` texts are stale and silently overridden by `TXT`.
- Enemy decks are small and never reshuffle.
- The pre-existing failing tests `ut32` (Shades answers), `ut2x`, `ut35o`, `t18`, `t2`, `t4` and `ut` are stale against current rules; ignore or rewrite them.
- The passing suite is ut41–ut47, t19, plus Playwright scripts (touchtest, combat, rot, desk, tour, playfull).
- Playwright uses the preinstalled Chromium: `NODE_PATH=$(npm root -g)`, `executablePath:'/opt/pw-browsers/chromium'`.
- `wrap.sh` adds a viewport meta for tests.

---

## 10. Art and UI direction

- The style is inspired by original Magic cards: retro but sleek.
- The battlefield is seamless, with few borders. The hand runs along the bottom like Slay the Spire. Nothing should look like solitaire.
- Card layout: name top left and mana cost top right, with rarity under the cost. Then the art box (emoji), the lore type line, rules text, power/health bottom right, and the 💀 sacrifice value as a skull badge on the art (shown everywhere, including enemy and hand cards).
- Stance labels ("⚔️ Attack form" in red, "🛡️ Defense form" in blue) float above the card, with a ⇄ switch affordance.
- Dark theme only. Each enemy has a two-colour background `bg`, e.g. Lotus-Eaters `#0b1a14 → #2f5a3a`, Muspelheim `#240a05 → #d4642a`.
- Map: a web of icon nodes on a dark field, with hover tips, an animated trail, and the glowing altar at the centre once 4 VP are reached.
- Desktop vs phone: section 9.
- **Art plan** (not started; only if Ben asks):
  - Replace emoji with AI art. Train a custom style LoRA for consistency, then use a shared style guide plus a per-card prompt manifest, starting with one hero.
  - Keep emoji as a fallback.
  - Image generators considered: Midjourney, Flux, Ideogram.

---

## 11. Decisions log (final ruling ← what it replaced)

- Combat is Magic-style against a thinking opponent ← Spire-style telegraphed enemies.
- Mana is a fixed 2 per turn plus offerings ← Hearthstone ramp ← fixed 3.
- Offering is the signature mechanic ← lands. Ben loved "sacrifices to the gods".
- Persistent damage, attack/defense forms, and attacking tapped units: these make it feel like armies rather than Magic.
- Player life is 20 for everyone; enemies have 15 base, scaled. Earlier: 30–40 player life, then lower to stop stalemates; enemies about 20, then 15.
- Max 5 army members per side.
- Temporary buffs keep their remaining health when they end ← expiry kills.
- Terminology: modifier (enchantment), item (artifact), quick spell (instant), spell (sorcery), fatigue (summoning sick), army member (creature), Prestige (Kleos/glory).
- Cut as too complicated: favor, hubris, hours, provisions, prophecy, omens.
- Starting deck = draft 11 + 4 staples ← fixed 15-card list.
- Run structure: a web map with AP/VP economy and 4 VP to the boss altar ← a linear 3-fight run ← a 3-lane map.
- Post-win choices (heal/draft/remove/duplicate) moved onto map locations.
- Three archetypes per hero plus a few generics ← 4–5 archetypes.
- Every enemy has a trump (tiered mini / elite / boss).
- Boss flavor text is 5 sentences ← 7 was too long.
- Odin's bosses: Jörmungandr, the Wild Hunt (Quarry), Hrungnir (Holmgang duel: max 2 army members per side, one attacker and one blocker; Ben accepts it may not scale to later acts).
  - Rejected: Fimbulwinter (saved for later) and the Baldr puzzle.
  - "The Claimed" is saved for a future boss.
- Odysseus's bosses: Hector, Scylla, Charybdis ← Achilles was rejected.
- Odysseus's elites: Circe and Cattle of the Sun. Odin's: the Norns and Fáfnir. Wukong's: Erlang Shen and Princess Iron Fan.
- Hero roster: Odin second, Wukong third, Egypt fourth (parked). Four heroes total.
- Phone: landscape only ← portrait dropped.
- AI ignores the player's possible quick spells when checking lethal, but considers whether it can block.
- Pool goal: about 80 cards per hero, 20 of each rarity.
- Workflow: discuss proposals before building unless Ben says "build". Make the change he asked for without rebalancing unless it clashes. Publish once at the end of a batch, not checkpoints.

---

## 12. Open questions and known bugs

- **Enemy decks run dry.** Shades of Hades has 8 cards, Fenrir's Brood 8, the Jotnar 9, and Wild Hunt / Hrungnir 9. Enemies never reshuffle, and those matchups stall the most. Decide: reshuffle the graveyard, give a fatigue penalty, or enlarge the decks?
- Out-of-band matchups: Odin vs Loki's Court (45%) and Odin vs Hel's Legion (24%). Odysseus vs the Lotus-Eaters and Wukong vs Red Boy (27%) are borderline.
- The v97 Norns changes are unit-tested but not visually verified in a real browser: the reveal titles "The Norns foretell…" and "The Norns: fate comes to pass", the 5-second pacing, and the foretold placeholder tooltip. The phone stance-label offset is also unverified.
- The enemy AI sometimes skips an attack it should take.
- The tier lists are stale (Odin from October 20, Odysseus older, Wukong none).
- Odysseus needs 4 more cards and Odin 6 to reach 80. Getting to 20 of each rarity also means rebalancing their rarity mix (Odysseus is currently 27/27/15/7).
- Act 3 and Act 4 are undesigned. The 3 shared final bosses are undecided.
- The second Odysseus elite was settled as Cattle of the Sun, which avoided another giant.
- Possible phone improvement offered but not requested: 1-tap blocking and targeting.

---

## 13. Roadmap

**Last work completed (v97):**
- Norns fight:
  - live, accurate card text;
  - OK-gated reveals at foretell time and at play time;
  - the foretold card resolves first;
  - 5-second pacing.
- Stance labels moved above cards.
- Cave Spiderling / enemy offering fix: only damaged 1-health creatures count as doomed, and the AI plays the card it offered for.
- Wukong fight-1 nudge.
- Before that: v96 was the landscape phone overhaul, and v95 added Wukong's last 20 cards, his 3 bosses, Iron Fan, and Act 2 realm randomization.

**Next, in priority order:**
1. Set up the repo from `mythologica-tooling.zip`: build, tests and sim. Decide on freezing the patch stack.
2. Fix enemy deck exhaustion, then retune the out-of-band matchups to 32–36%.
3. Regenerate tier lists for all three heroes. Buff or nerf the outliers (Pyre of Heroes, Mimir's Well, Skull-Cleaver, Starkad, Uruz, Fehu…).
4. Bring Odysseus and Odin to 80 cards each at 20/20/20/20. Discuss card proposals with Ben before building.
5. Act 3 (all-realm amalgam) and its 3 shared final bosses. Design with Ben first.
6. The Egypt hero (duality, briefly suspending death; Thoth?).
7. The art pipeline (style LoRA plus prompt manifest), only when Ben asks.
8. Act 4.

**Ideas discussed, not built:**
- "The Claimed" boss mechanic.
- The Fimbulwinter clock.
- Hrungnir-style duels for later acts.
- Phone 1-tap block and target.
- Meta-progression.
- Map events.
- Wukong order combos (Strike → Trick → Leap sequences) beyond the cards that exist (Full Circle, Counter-Strike, Feint, Slip Away).

---

## Start here

1. Unzip `mythologica-tooling.zip` into the repo, fix the hard-coded `S=` / `cd` paths in `build.py` and `runset.sh`, and run `./rebuild.sh` plus `node ut47.js n1.html` (and ut41–46, t19) to confirm the build is green. Then decide whether to freeze the patch stack into a single `index.html` source (recommended).
2. Reproduce the section 8 balance numbers with `./runset.sh n1.html base 300 "ody:0 … wukong:5"`. Expect about ±3 points at N=300. Play one fight with each hero in a browser to learn the feel.
3. Decide with Ben how to handle enemy deck exhaustion (section 12), then retune Odin vs Loki's Court and Odin vs Hel's Legion into the 32–36% band.
