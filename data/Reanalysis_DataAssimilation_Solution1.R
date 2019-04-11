data <- read.table("Reanalysis_DataAssimilation_Exercise1_Data.txt",header=T)
lambda <- 0.5
forecast <- function(x,dt) {
  xb <- x*exp(-lambda*dt)
  return(xb)
} 
analysis <- function(xb,y,sb2,sy2) {
  x <- xb+(y-xb)*sb2/(sb2+sy2)
  return(x)
} 

xb <- c(1000,rep(NA,20))
x <- c(1000,rep(NA,20))
for (i in 2:21){
  xb[i] <- forecast(x[i-1],data[i,1]-data[i-1,1])
  x[i] <- analysis(xb[i],data[i,3],data[i,2],data[i,4])
}   