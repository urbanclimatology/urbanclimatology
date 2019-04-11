data <- read.table("Reanalysis_DataAssimilation_Exercise2_Data.txt",header=T)
g <- 9.80665
a <- 44.2
k <- 500
b <- 0.01
r <- 9
l <- a*b/(a^2*b+r)

xb <- c(23.4,rep(NA,20))
zb <- c(0,rep(NA,20))
x <- c(23.4,rep(NA,20))
z <- c(0,rep(NA,20))
u <- c(-18,rep(NA,20))
w <- c(12,rep(NA,20))

