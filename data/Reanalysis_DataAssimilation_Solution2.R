data <- read.table("Reanalysis_DataAssimilation_Exercise2_Data.txt",header=T)
g <- 9.80665
a <- 44.2
k <- 500
b <- 0.01
r <- 9
l <- a*b/(a^2*b+r)

forecast.x <- function(x,u,dt) {
  xb <- x+u*dt
  return(xb)
} 

forecast.z <- function(z,w,g,dt) {
  zb <- z+w*dt-(0.5*g*(dt^2)) 
  return(zb)
} 

analysis.x <- function(xb,i,a,k,l) {
  x <- xb+(i-a*xb)*l
  return(x)
} 

analysis.z <- function(zb,j,a,k,l) {
  z <- zb-(j-(k-a*zb))*l
  return(z)
} 

xb <- c(23.4,rep(NA,20))
zb <- c(0,rep(NA,20))
x <- c(23.4,rep(NA,20))
z <- c(0,rep(NA,20))
u <- c(-18,rep(NA,20))
w <- c(12,rep(NA,20))

for (i in 2:21){
  xb[i] <- forecast.x(x[i-1],u[i-1],data[i,1]-data[i-1,1])
  zb[i] <- forecast.z(z[i-1],w[i-1],g,data[i,1]-data[i-1,1])
  x[i] <- analysis.x(xb[i],data[i,2],a,k,l)
  z[i] <- analysis.z(zb[i],data[i,3],a,k,l)
  u[i] <- ((x[i]-x[i-1])/(data[i,1]-data[i-1,1]))
  w[i] <- ((z[i]-z[i-1])/(data[i,1]-data[i-1,1]))-(0.5*g*(data[i,1]-data[i-1,1]))
}   

