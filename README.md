2026-02-25 14:49:49.549 [info] 
> git checkout -q main [137ms] 2026-02-25 14:49:49.549 [info] error: you need to resolve your current index first 2026-02-25 14:49:49.589 [info]
> git symbolic-ref --short HEAD [36ms] 2026-02-25 14:49:49.634 [info] 
> git for-each-ref --format=%(refname)%00%(upstream:short)%00%(objectname)%00%(upstream:track)%00%(upstream:remotename)%00%(upstream:remoteref) --ignore-case refs/heads/main refs/remotes/main [43ms] 2026-02-25 14:49:49.680 [info]
> git for-each-ref --sort -committerdate --format %(refname)%00%(objectname)%00%(*objectname) [38ms] 2026-02-25 14:49:49.799 [info]
> git status -z -uall [162ms] 2026-02-25 14:49:50.379 [info] 
> git check-ignore -v -z --stdin [36ms]
> Voici les erreurs que j'ai eut lors du commit. pour simplifier c'est Hugo qui s'est occuper de commit pour moi. Grégoire MERCIER
