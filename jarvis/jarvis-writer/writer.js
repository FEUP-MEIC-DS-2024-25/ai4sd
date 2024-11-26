df = spark.read.format("parquet").load("gs://hero-alliance-nexus")
