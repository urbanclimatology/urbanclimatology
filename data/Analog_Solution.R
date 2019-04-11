pool <- read.table("Applications_Analog_Data_Pool.txt",header=T)
cand <- read.table("Applications_Analog_Data_Candidates.txt",header=T)

candprec <- NULL
for (i in 1:length(cand[,1])){
 d <- (((pool[,5]-cand[i,4])^2)+((pool[,6]-cand[i,5])^2)+((pool[,7]-cand[i,6])^2))^0.5
 candprec <- c(candprec,pool[,4][d == min(d)])
}
 

