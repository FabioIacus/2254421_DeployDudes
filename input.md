# SYSTEM DESCRIPTION:

We are in 2036. After a 12-hour shift of questionable architectural decisions at SpaceY, you are “promoted” to Mars Operations by being accidentally shipped to Mars while sleeping at your desk. You wake up in a fragile habitat whose automation stack is partially destroyed. Devices speak incompatible dialects. Some of them stream telemetry. Others respond only to polling. Actuators are still reachable, if you can invoke them correctly.
Our mission: rebuild a distributed automation platform capable of ingesting heterogeneous sensor data, normalizing it into a unified internal representation, evaluating simple automation rules, and providing a real-time dashboard for habitat monitoring.
Failure means thermodynamic consequences.

# USER STORIES:

# Modulo 1: Ingestione e Normalizzazione Dati (The Ingestion)

Queste storie descrivono come il sistema acquisisce i dati. Nel mockup potresti disegnare un pannello della dashboard che mostra lo stato di "Connessione" ai vari sensori.

US1: Come sistema, voglio interrogare i sensori REST a intervalli regolari (polling), per raccogliere i dati ambientali come temperatura e pressione.
+3

US2: Come sistema, voglio connettermi ai flussi di telemetria tramite SSE o WebSocket, per ricevere dati asincroni (es. radiazioni, pannelli solari).
+2

US3: Come architetto del software, voglio che i dati eterogenei in ingresso vengano convertiti in un formato di evento JSON standardizzato, per avere una base dati unificata.

US4: Come sistema, voglio pubblicare gli eventi normalizzati su un message broker interno, per disaccoppiare la raccolta dati dalla loro elaborazione.

# Modulo 2: Motore di Automazione e Stato (The Brain)

Qui si gestisce la logica. Il mockup potrebbe essere la schermata di creazione delle regole o un pannello di log che mostra l'attivazione degli attuatori.

US5: Come motore di automazione, voglio mantenere in memoria (cache) lo stato più recente di ogni sensore, per avere sempre l'ultimo valore disponibile.
+1

US6: Come utente, voglio creare regole automatiche nel formato "IF [sensore] [operatore] [valore] THEN set [attuatore] to [ON/OFF]", per automatizzare la sopravvivenza dell'habitat .

US7: Come utente, voglio che le mie regole vengano salvate in un database, così non andranno perse se il sistema si riavvia.
+1

US8: Come motore di automazione, voglio valutare dinamicamente le regole ogni volta che arriva un nuovo evento, per capire se devo attivare un'emergenza.

US9: Come sistema, voglio inviare una richiesta POST al simulatore quando una regola viene soddisfatta, per modificare lo stato dell'attuatore (es. accendere cooling_fan).
+1

US10: Come utente, voglio poter visualizzare una lista di tutte le regole di automazione attive nel sistema.

# Modulo 3: Dashboard Real-Time (The Frontend)

Queste sono le storie più visive. I mockup saranno veri e propri wireframe dell'interfaccia utente.

US11: Come operatore marziano, voglio visualizzare una dashboard in tempo reale, per monitorare lo stato generale della base.
+1

US12: Come utente, voglio vedere il valore in tempo reale di uno specifico sensore (es. livello del serbatoio dell'acqua) tramite un widget dedicato.

US13: Come utente, voglio visualizzare un grafico a linee per i flussi di telemetria che si aggiorni continuamente mentre la pagina è aperta.

US14: Come utente, voglio vedere lo stato attuale degli attuatori (es. se l'umidificatore è ON o OFF) direttamente dalla dashboard.

US15: Come utente, voglio un bottone (toggle) sulla dashboard per poter accendere o spegnere manualmente un attuatore in caso di necessità.
