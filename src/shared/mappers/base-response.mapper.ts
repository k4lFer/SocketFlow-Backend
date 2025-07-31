// shared/mappers/base-response.mapper.ts
export abstract class BaseResponseMapper<TDomain, TResponseDto> {
  abstract toResponse(domain: TDomain): TResponseDto;
  abstract toListResponse(domains: TDomain[]): TResponseDto[];
}