use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use actix_cors::Cors;
use risc0_zkvm::{Prover, Receipt};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct VoteData {
    voter_id: u64,
    proposal_id: u64,
    vote: bool,
}

#[derive(Serialize)]
struct VoteProof {
    receipt: Vec<u8>,
}

async fn submit_vote(vote_data: web::Json<VoteData>) -> impl Responder {
    let VoteData {
        voter_id,
        proposal_id,
        vote,
    } = vote_data.into_inner();

    // Load the ZKVM ELF binary (replace with the path to your ZKVM program)
    let prover = Prover::new("path/to/zkvm/elf").expect("Failed to load ZKVM program");

    // Run the ZKVM to generate a proof
    let receipt: Receipt = prover
        .run(&(voter_id, proposal_id, vote))
        .expect("Failed to generate proof");

    // Serialize the receipt to send it back to the frontend
    let proof = VoteProof {
        receipt: bincode::serialize(&receipt).expect("Failed to serialize receipt"),
    };

    HttpResponse::Ok().json(proof)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();

        App::new()
            .wrap(cors)
            .route("/submit_vote", web::post().to(submit_vote))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}