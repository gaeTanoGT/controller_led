Progetto client server per l'interfacciamento verso delle strisce LED pilotabili solo attraverso telecomando infrarossi

requisiti:
- nodeMCU
- ir led
- piattaforma per depositare il sito web

accedendo attraverso l'ip del server sarà possibile visualizzare la pagina index.html
lo script della pagina integra delle API per la comunicazione verso il nodeMCU
il nodeMCU alla ricezione dei messaggi invia segnali infrarossi specifici al ricevitore delle strisce led, simulandone il controller
oltretutto la pagina aggiorna dinamicamente lo stato dei pulsanti in base alle modifiche effettuate da altri client
