<?php

namespace App\Controller;

use App\Entity\Liga;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class LigaNoTerminadaController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function __invoke(): JsonResponse
    {
        $ligas = $this->entityManager->getRepository(Liga::class)->findBy([
            'terminada' => false
        ]);

        // Serializa las ligas en un array simple
        $data = [];
        foreach ($ligas as $liga) {
            $data[] = [
                'id' => $liga->getId(),
                'name' => $liga->getName(),
                'jornadas' => $liga->getJornadas(),
                'terminada' => $liga->isTerminada()
            ];
        }

        return new JsonResponse($data);
    }
}