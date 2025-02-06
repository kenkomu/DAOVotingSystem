import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface Proposal {
  id: number
  title: string
  description: string
  status: string
}

interface ResultsProps {
  proposals: Proposal[]
}

export default function Results({ proposals }: ResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Voting Results</CardTitle>
        <CardDescription>View results for completed proposals</CardDescription>
      </CardHeader>
      <CardContent>
        {proposals
          .filter(p => p.status === "Completed")
          .map(proposal => (
            <div key={proposal.id} className="mb-4">
              <h3 className="text-lg font-semibold">{proposal.title}</h3>
              <div className="flex justify-between mt-2">
                <span>Yes: 75%</span>
                <span>No: 25%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-green-600 h-2.5 rounded-full" style={{width: "75%"}}></div>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  )
}