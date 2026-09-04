plugins { kotlin("jvm") version "2.1.0"; application }
repositories { mavenCentral() }
dependencies { implementation("org.apache.kafka:kafka-clients:3.9.1") }
application { mainClass.set("EventForgeConsumerKt") }
kotlin { jvmToolchain(21) }
