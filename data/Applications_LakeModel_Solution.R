data <- read.table("Applications_LakeModel_Data.txt",header=T)
level <- c(5000,rep(NA,length(data[,1])-1))

for (i in 2:length(data[,1])){level[i] <- level[i-1]*exp(-1*0.004)+10*data[i,4]}
navig <- level > 5000 & level < 8000
sum(navig)/length(data[,1])

