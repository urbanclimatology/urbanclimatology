#Station	St. Gallen	
#Coordinates	47.7° N, 9.63° E
#Altitude	776	m asl
#Observer	Daniel Meyer	
#Variables	pressure (unit: Paris inch) reduced to 10°Réaumur, temperature (unit °Réaumur), wind	
#Resolution	2 / day – 2 / day - 2 / day - 2 / day	
#Period	Jan 1813 - Dez 1816	

data <- read.table("ClimateData_Process_Data.txt",header=T)
lat <- 47.7
alt <- 776
gn <- 9.80665

