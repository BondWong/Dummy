export JAVA_HOME=$(/usr/libexec/java_home)
export PATH=$PATH:/usr/local/apache-maven/apache-maven/bin
export MAVEN_OPTS="-Xms1024m -Xmx1024m -XX:PermSize=128m -XX:MaxPermSize=512m"
export JAVA_OPTS="-Xms1024m -Xmx1024m -XX:PermSize=128m -XX:MaxPermSize=512m"


# Setting PATH for Python 3.5
# The orginal version is saved in .bash_profile.pysave
PATH="/Library/Frameworks/Python.framework/Versions/3.5/bin:${PATH}"
export PATH

alias vim='/usr/local/Cellar/vim/7.4.944/bin/vim'

alias ls='ls -G'
LS_COLORS='di=32:fi=0:ln=31:pi=5:so=5:bd=5:cd=5:or=33:mi=93:ex=35'
export LS_COLORS
