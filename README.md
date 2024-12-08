
#🌊 Jeu d'Exploration Marine : Véhicules, Boids & Prédateurs 🐟🦈

>#MADE BY : **JOUIDA SOUFIANE **

================================================================================================================================

Bienvenue dans mon projet d'exploration sous-marine. J'ai essayé de créer un environnement qui présente la nature sous-marine : les poissons (boids), les requins (boids avec comportement de chasse), les plongeurs (véhicules), des tanks sous-marins (véhicules tirant des projectiles) et une petite méduse qui suit la cible "The King" (un petit souvenir du king qui nous a fait découvrir le monde de la création des jeux).

📖 Description
Ce jeu, développé avec p5.js, combine plusieurs mécaniques :

Contrôle de véhicules : Dirigez un véhicule sous-marin avec des capacités avancées de déplacement et de tir.

Simulation de boids : Observez des poissons se déplaçant en bancs grâce à un algorithme de flocking (alignement, cohésion, séparation) et qui entrent en collision avec les plongeurs (fleeWithTargetRadius, collide).

Prédateur intelligent : Affrontez un requin prédateur qui poursuit les boids et les plongeurs. Une fois que tous les humains sont morts, vous perdez.

Animations immersives : Interagissez avec la méduse. J'ai essayé d'implémenter des mouvements réalistes.

Behaviors :

Fishes : implémentation de cohésion, alignement, séparation, flee, avoid, wander, boundaries.

Plongeurs : wander, collide.

Shark : wander, getVehiculeLePlusProche, getBoidLePlusProche, seek, collide.

Méduse : seek, arrival (j'ai diminué la distance au maximum pour obtenir un effet réaliste).
🦈 Les Modes :

Wander ("W") : Le requin se balade en paix dans la mer.

Kill ("K") : Le requin chasse les plongeurs et les mange. Si tous les plongeurs sont morts, le jeu se termine et vous avez la possibilité de rejouer.

Predator ("P") : Le requin chasse les poissons. Choisissez un poisson et observez combien de temps il va survivre.

Debug ("D") : Affiche les forces, le champ de vision et les boundaries.

Random ("R") : Change la taille des poissons de façon aléatoire.

⌨️ Les Touches :

⚠️⚠️ Le jeu est sensible aux majuscules et minuscules ⚠️⚠️

h : pour afficher la section aide.

D : pour activer le débogage.

P : pour activer le mode predator.

K : pour activer le mode kill.

W : pour activer le mode wander.

Cliquez sur la souris et tirez pour faire apparaître des poissons.

Contrôler le tank :

"w" ou ⬆️ : avancer.

"s" ou ⬇️ : reculer.

"a" ou ⬅️ : aller à gauche.

"d" ou ➡️ : aller à droite.

Cliquez sur la souris pour tirer.


🎯 Perspectives :
La caméra suit le tank.
le tank doit tuer le requin avans qu'il mange les plangeurs .
chaque niveau terminer ,la vitesse du requin augmente ,
des bebe requins qui spawn aleatoirement et qui attaque le tank .

J'ai créé une fonctionnalité takeDamage pour le requin. Une fois implémentée, j'ai rencontré plusieurs problèmes au point que rien ne fonctionnait. J'ai investi beaucoup d'efforts et de temps pour les résoudre. Ceci est la version 1. Les contrôles commencent lundi. Une fois qu'ils seront terminés, j'essaierai d'améliorer ce projet et je vous enverrai les modifications.

