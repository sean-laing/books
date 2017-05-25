#!/usr/local/bin/Rscript --quiet

booktypes = commandArgs(trailingOnly=TRUE)

modeled_features <- read.table(file("stdin"), header=T, sep='\t')
modeled_features[is.na(modeled_features)] <- 0;
#runif creates a vector of random number - random unifrom
modeled_features$rowgroup <- runif(dim(modeled_features)[1]) 
#split into test and training data
training_features <- subset(modeled_features, modeled_features$rowgroup > .5)
test_features <- subset(modeled_features, modeled_features$rowgroup <= .5)
evaluate_columns <- setdiff(colnames(modeled_features), list('rowgroup', 'bookname', 'booktype'))

#load random forest and training our model using the modeled_features
library(randomForest)
model <- randomForest(x=training_features[,evaluate_columns], y=training_features$booktype)
test_prediction <- predict(model, newdata=test_features[,evaluate_columns], type='prob')
all_prediction <- predict(model, newdata=modeled_features[,evaluate_columns], type='prob')
#some basic eval code, taken from Pratical Data Science with R
loglikelihood <- function(y, py) { 
  pysmooth <- ifelse(py==0, 1e-12,
                  ifelse(py==1, 1-1e-12, py))

  sum(y * log(pysmooth) + (1-y)*log(1 - pysmooth))
}

#some basic eval code, taken from Pratical Data Science with R
#modifed to return precision and recall, along with f1, and accuracy
accuracyMeasures <- function(pred, truth, name="model") {  
  dev.norm <- -2*loglikelihood(as.numeric(truth), pred)/length(pred)  	
  ctable <- table(truth=truth,pred=(pred>0.5))                                    	
  accuracy <- sum(diag(ctable))/sum(ctable)
  precision <- ctable[2,2]/sum(ctable[,2])
  recall <- ctable[2,2]/sum(ctable[2,])
  f1 <- 2*precision*recall/(precision+recall)
  data.frame(model=name, accuracy=accuracy, f1=f1, dev.norm=dev.norm, precision=precision, recall=recall)
}

accuracyFrame <- data.frame()
outputFrame <- data.frame(bookname = modeled_features[,'bookname'])
outputFrame <- cbind(outputFrame, booktype = modeled_features[,'booktype'])

for(i in booktypes){
  accuracyFrame <- rbind(accuracyFrame, accuracyMeasures(test_prediction[,i], test_features$booktype==i))
  outputFrame <- cbind(outputFrame, as.vector(smooth(all_prediction[,i])))
  colnames(outputFrame)[dim(outputFrame)[2]] <- i
}

write.table(outputFrame, stdout(), sep='\t', col.names = T, row.names = F)
write.table(format(accuracyFrame, digits=6), stderr(), col.names = F, row.names = F)
