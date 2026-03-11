// ... existing imports and code ...

const CompetitiveAnalysis = () => {
  // ... existing code ...

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <BarChart3 className="h-5 w-5 mr极2 text-purple-600" />
          Competitive Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Competitors List */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-4 w-4 mr-2 text-blue-600" />
              Nearby Competitors
            </h3>
            <div className="space-y-3">
              {competitors.map((competitor) => (
                <div key={competitor.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{competitor.name}</h4>
                      <p className="text-sm text-gray-500">{competitor.distance} away</p>
                    </div>
                    <Badge className={getSentimentColor(competitor.sentiment)}>
                      {competitor.sentiment.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-amber-500 mr-1" />
                      <span>{competitor.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 text-gray-500 mr-1" />
                      <span>{'$'.repeat(competitor.priceLevel)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 text-gray-500 mr-1" />
                      <span>{competitor.avgWaitTime} min</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 text-gray-500 mr-1" />
                      <span>{competitor.marketShare}% share</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedCompetitor(
                        expandedCompetitor === competitor.id ? null : competitor.id
                      )}
                    >
                      {expandedCompetitor === competitor.id ? 'Hide' : 'Show'} Details
                    </Button>
                    <Progress value={competitor.market极are} className="w-20 h-2" />
                  </div>

                  {expandedCompetitor === competitor.id && (
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium mb-2">Popular Items:</p>
                      <div className="space-y-1">
                        {competitor.popularItems.map((item, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Market Insights */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
              Market Insights
            </h3>
            <div className="space-y-3">
              {marketInsights.map((insight) => (
                <div key={insight.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                    <div className="flex items-center">
                      {getTrendIcon(insight.trend)}
                      <Badge className={`ml-2 ${getImpactColor(insight.impact)}`}>
                        {insight.impact.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analysis
                  </Button>
                </div>
              ))}
            </div>

            {/* Market Summary */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
              <h4 className="font-semibold text-purple-600 mb-2">Market Position</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600/70">Your market share</p>
                  <p className="text-2xl font-bold text-purple-600">20%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-purple-600/极">Growth</p>
                  <p className="text-lg font-bold text-green-600">+5%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitiveAnalysis;