data <- read.table("Applications_LakeModel_Data.txt",header=T)
level <- c(5000,rep(NA,length(data[,1])-1))

