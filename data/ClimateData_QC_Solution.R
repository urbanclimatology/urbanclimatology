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


### QC
library(zoo)

physcheck <- function(x,x0) {
  f <- x < x0
  return(f)
} 

rangecheck <- function(x,xmin,xmax) {
  f <- x < xmin | x > xmax
  return(f)
} 

variancecheck <- function(x) {
  xmean <- mean(x,na.rm=T)
  xsd <- sd(x,na.rm=T)
  f <- abs(x-xmean)/xsd >4 
  return(f)
} 

diffcheck <- function(x,max.diff) {
  diff <- abs(x[2:length(x)]-x[1:length(x)-1]) > max.diff
  f <- c(F,diff)|c(diff,F)
  return(f)
} 

consecutivecheck <- function(x) {
  msd <- rollapply(x,4,sd)==0 
  f <- c(msd,F,F,F) == T | c(F,msd,F,F) == T | c(F,F,msd,F) == T | c(F,F,F,msd) == T
  return(f)
} 

flag.t.sunrise.phys <- physcheck(t.sunrise.degC,-273.15)
flag.t.sunrise.range <- rangecheck(t.sunrise.degC,-80,60)
flag.t.sunrise.var <- variancecheck(t.sunrise.degC)
flag.t.sunrise.diff <- diffcheck(t.sunrise.degC,25)
flag.t.sunrise.cons <- consecutivecheck(t.sunrise.degC)

flag.t.sunset.phys <- physcheck(t.sunset.degC,-273.15)
flag.t.sunset.range <- rangecheck(t.sunset.degC,-80,60)
flag.t.sunset.var <- variancecheck(t.sunset.degC)
flag.t.sunset.diff <- diffcheck(t.sunrset.degC,25)
flag.t.sunset.cons <- consecutivecheck(t.sunset.degC)

flag.p.sunrise.phys <- physcheck(p.sunrise.hPa.g,0)
flag.p.sunrise.range <- rangecheck(p.sunrise.hPa.g,500,1100)
flag.p.sunrise.var <- variancecheck(p.sunrise.hPa.g)
flag.p.sunrise.diff <- diffcheck(p.sunrise.hPa.g,40)
flag.p.sunrise.cons <- consecutivecheck(p.sunrise.hPa.g)

flag.p.sunset.phys <- physcheck(p.sunset.hPa.g,0)
flag.p.sunset.range <- rangecheck(p.sunset.hPa.g,500,1100)
flag.p.sunset.var <- variancecheck(p.sunset.hPa.g)
flag.p.sunset.diff <- diffcheck(p.sunset.hPa.g,40)
flag.p.sunset.cons <- consecutivecheck(p.sunset.hPa.g)

