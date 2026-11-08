# ===== opponents have 15 health in Act 1 (bosses and later acts can have more) =====
assert head.count(",l:20,")==6 or head.count("l:20,")==6, head.count("l:20,")
head=head.replace("l:20,","l:15,")
