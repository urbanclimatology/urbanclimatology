data <- read.table("ClimateData_Homogenize_BreakDetection_Data.txt",header=T)

s <- cumsum(data[,3]-data[,4]-mean(data[,3]-data[,4]))
timeaxis <- data[,1]+data[,2]/12
plot(timeaxis,s,type="l")

## breaks 2001/2002, 2003/2004, 2007/2008
## homegeneous subperiods: 2000-2001, 2002-2003, 2004-2007, 2008-2011


### break correction:
yr <- data[,1]
period1 <- yr==2000 | yr==2001
period2 <- yr==2002 | yr==2003
period3 <- yr>2003 & yr<2008
period4 <- yr>2007

offset <- rep(NA,length(data[,3])) 
tempdiff.period4 <- mean(data[period4,3]-data[period4,4])
offset[period4] <- 0
offset[period3] <- mean(data[period3,3]-data[period3,4])-tempdiff.period4
offset[period2] <- mean(data[period2,3]-data[period2,4])-tempdiff.period4
offset[period1] <- mean(data[period1,3]-data[period1,4])-tempdiff.period4

homogenized <- data[,3]-offset

sh <- cumsum(homogenized-data[,4]-mean(homogenized-data[,4]))
timeaxis <- data[,1]+data[,2]/12
plot(timeaxis,sh,type="l")


