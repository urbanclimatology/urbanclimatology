#Station	St. Gallen	
#Coordinates	47.7° N, 9.63° E
#Altitude	776	m asl
#Observer	Daniel Meyer	
#Variables	pressure (unit: Paris inch), temperature (unit °Réaumur), wind	
#Resolution	2 / day – 2 / day - 2 / day - 2 / day	
#Period	Jan 1813 - Dez 1816	

data <- read.table("ClimateData_Process_Data.txt",header=T)
lat <- 47.42*pi/180
alt <- 776
gn <- 9.80665
gl <- 9.8062*(1-0.0026442*cos(2*lat)-0.0000058*cos(2*lat)^2)-0.000003086*alt

# units
p.sunrise.mm <- 27.07*data[,4]
p.sunset.mm <- 27.07*data[,6]
t.sunrise.degC <- data[,5]/0.8
t.sunset.degC <- data[,7]/0.8

# reduce pressure to 0 deg
p.sunrise.mm.0 <- (1-0.000182*(10/0.8))*p.sunrise.mm
p.sunset.mm.0 <- (1-0.000182*(10/0.8))*p.sunset.mm

# conversion to hPa
p.sunrise.hPa <- 13595.1*9.80665*p.sunrise.mm.0*0.00001
p.sunset.hPa <- 13595.1*9.80665*p.sunset.mm.0*0.00001

# gravity correction 
p.sunrise.hPa.g <- p.sunrise.hPa*gl/gn
p.sunset.hPa.g <- p.sunset.hPa*gl/gn

# reduction to msl
p.sunrise.msl <- p.sunrise.hPa.g*exp((gl*alt/287.05)/(t.sunrise.degC+273.15+(0.0065*alt/2)))
p.sunset.msl <- p.sunset.hPa.g*exp((gl*alt/287.05)/(t.sunset.degC+273.15+(0.0065*alt/2)))


