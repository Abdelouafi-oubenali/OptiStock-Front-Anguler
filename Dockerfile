# Utiliser l'image officielle Tomcat avec JDK 17
FROM tomcat:10.1-jdk17

# Supprimer les applications par défaut de Tomcat
RUN rm -rf /usr/local/tomcat/webapps/*

# Copier ton fichier WAR compilé dans le dossier webapps de Tomcat
# Remplace 'mon-projet.war' par le nom réel de ton WAR généré
COPY target/mon-projet.war /usr/local/tomcat/webapps/ROOT.war

# Exposer le port 8080 (Tomcat)
EXPOSE 8080

# Commande pour lancer Tomcat (déjà définie par l'image)
CMD ["catalina.sh", "run"]
